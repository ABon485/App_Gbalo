import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    Pressable,
    ImageSourcePropType,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import ImageGalleryModal from '@/components/rating/ImageGalleryModal';
import { TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import bookingApi from '@/services/tour';
import { Review, ReviewDetailResponse } from '@/types/tour';

export default function z() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState<ImageSourcePropType[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useLocalSearchParams();

    // Fetch review data when component mounts
    useEffect(() => {
        const fetchReview = async () => {
            const ratingId = params.ratingId as string;
            if (!ratingId) {
                console.error('No ratingId provided');
                setLoading(false);
                return;
            }

            try {
                const response: ReviewDetailResponse = await bookingApi.getRatingById(parseInt(ratingId, 10));
                setReview(response.data);
                setSelectedImages(response.data.imageUrls.map((uri) => ({ uri })));
            } catch (error) {
                console.error('Failed to fetch review:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [params.ratingId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!review) {
        return (
            <View style={styles.container}>
                <Text>Không tìm thấy đánh giá</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header cố định */}
            <TouchableOpacity
                style={[styles.header, { paddingHorizontal: 16 }]}
                onPress={() => router.back()}
            >
                <AntDesign name="arrowleft" size={20} color="black" />
                <Text style={styles.rating}> Đánh giá của bạn </Text>
            </TouchableOpacity>

            {/* ScrollView cho phần đánh giá */}
            <ScrollView style={{ paddingHorizontal: 16 }}>
                {/* Điểm số tổng quan */}
                <View style={[styles.headerBody, { paddingHorizontal: 12 }]}>
                    <Text style={styles.ratingText}>
                        Ngày đánh giá: {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                </View>
                <View style={styles.reviewCard}>
                    <View style={styles.userRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.time}></Text>
                            </View>
                            <View style={styles.starRow}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <AntDesign
                                        key={i}
                                        name={i < review.star ? 'star' : 'staro'}
                                        size={14}
                                        color="#F97316"
                                    />
                                ))}

                            </View>
                        </View>
                    </View>
                    <Text style={styles.ratingTour}>
                        Đánh giá cho tour: <Text style={styles.ratingTourName}>{review.serviceName}</Text>
                    </Text>

                    <Text style={styles.content}>{review.comment}</Text>

                    {review.imageUrls.length > 0 && (
                        <View style={styles.imageRow}>
                            {review.imageUrls.map((uri, idx) => (
                                <Pressable
                                    key={idx}
                                    style={styles.imageWrapper}
                                    onPress={() => {
                                        setSelectedIndex(idx);
                                        setModalVisible(true);
                                    }}
                                >
                                    <Image source={{ uri }} style={styles.reviewImage} />
                                    {idx === 1 && review.imageUrls.length > 2 && (
                                        <View style={styles.overlay}>
                                            <Text style={styles.overlayText}>+{review.imageUrls.length - 2}</Text>
                                        </View>
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    )}

                    {/* Image Modal Viewer */}
                    <ImageGalleryModal
                        visible={modalVisible}
                        images={selectedImages.map((img) =>
                            typeof img === 'number' ? img : (img as { uri?: string }).uri ?? ''
                        )}
                        index={selectedIndex}
                        onClose={() => setModalVisible(false)}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 35,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerBody: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rating: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    ratingText: {
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 16,
    },
    reviewCard: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 16,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    starRow: {
        flexDirection: 'row',
        marginTop: 2,
    },
    ratingTour: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 20,
    },
    ratingTourName: {
        fontWeight: '400',
        color: '#000',
    },
    time: {
        color: '#888',
        fontSize: 12,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
        marginTop: 10,

    },
    imageRow: {
        flexDirection: 'row',
        gap: 8,
    },
    reviewImage: {
        width: 160,
        height: 120,
        borderRadius: 8,
    },
    imageWrapper: {
        position: 'relative',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    overlayText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});