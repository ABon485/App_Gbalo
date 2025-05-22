import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import tourApi from '@/services/tour';
import { TourItem, ProvinceType } from '@/types/tour';
import { Heart, SlidersHorizontal } from 'lucide-react-native';
import SearchFilters from '@/components/home/Search-filters';

const SearchResult = () => {
    const { searchQuery: initialSearchQuery, selectedProvinceId: initialProvinceId } = useLocalSearchParams();
    const [tours, setTours] = useState<TourItem[]>([]);
    const [allTours, setAllTours] = useState<TourItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>(typeof initialSearchQuery === 'string' ? initialSearchQuery : '');
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>(typeof initialProvinceId === 'string' ? initialProvinceId : 'all');
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<ProvinceType[]>([]);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [searchTrigger, setSearchTrigger] = useState<number>(0);
    const [allProvinces, setAllProvinces] = useState<ProvinceType[]>([]);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (isFirstLoad) {
            fetchTours();
            setIsFirstLoad(false);
        }
    }, [isFirstLoad]);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const responseTours = await tourApi.ListTour(1, 100);
            console.log("API Tours response:", responseTours.data.datas.length);

            const fetchedTours: TourItem[] = responseTours.data.datas.map((item: any) => {
                let provinceIds = [];

                if (item.provinceIds && Array.isArray(item.provinceIds)) {
                    provinceIds = item.provinceIds.map((id: any) =>
                        typeof id === 'string' ? parseInt(id, 10) : id
                    );
                } else if (item.provinceId) {
                    const id = typeof item.provinceId === 'string' ?
                        parseInt(item.provinceId, 10) : item.provinceId;
                    provinceIds = [id];
                }

                return {
                    id: item.id.toString(),
                    name: item.name,
                    slug: item.slug,
                    featuredImageUrl: item.featuredImageUrl || 'default_image_url',
                    vote: item.vote || 0,
                    fromPrice: item.fromPrice || 0,
                    isFavorite: false,
                    provinceIds: provinceIds,
                    tourExtraServices: [],
                };
            });

            if (fetchedTours.length > 0) {
                console.log("Tour example:", fetchedTours[0]);
            }

            setAllTours(fetchedTours);
            return fetchedTours;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tour:', error);
            setError('Không tải được danh sách tour');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchProvinceSuggestions = async (keyword: string) => {
        try {
            if (!allProvinces.length) {
                const provinces = await tourApi.getProvince();
                console.log("Fetched provinces:", provinces.length);
                setAllProvinces(provinces);
            }

            const normalizeText = (text: string) =>
                text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

            const filteredProvinces = allProvinces.filter((province) =>
                normalizeText(province.name).includes(normalizeText(keyword))
            );

            console.log(`Found ${filteredProvinces.length} province suggestions for "${keyword}"`);
            setSuggestions(filteredProvinces);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tỉnh:', error);
            setSuggestions([]);
        }
    };

    const searchTours = async (provinceId: string, keyword: string, filters: any = {}) => {
        try {
            setLoading(true);
            setError(null);
            setHasSearched(true);

            console.log(`Searching for tours: provinceId=${provinceId}, keyword=${keyword}`);

            let toursToFilter = allTours;
            if (!allTours.length) {
                console.log("No tours loaded yet, fetching tours first...");
                toursToFilter = await fetchTours();
            }

            console.log(`Total tours to filter: ${toursToFilter.length}`);

            const provinceIdNum = provinceId !== 'all' ? parseInt(provinceId, 10) : null;

            const normalizeText = (text: string) =>
                text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const normalizedKeyword = normalizeText(keyword);
            let filteredTours = toursToFilter.filter((tour) => {
                let matchProvince = false;

                if (provinceId === 'all') {
                    matchProvince = true;
                } else if (tour.provinceIds && Array.isArray(tour.provinceIds)) {
                    matchProvince = tour.provinceIds.some(id => {
                        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
                        return numId === provinceIdNum;
                    });
                }

                const matchKeyword = normalizeText(tour.name).includes(normalizedKeyword);

                if (matchProvince && matchKeyword) {
                    console.log(`Found matching tour: ${tour.name}`);
                }

                return matchProvince && matchKeyword;
            });

            // Apply additional filters
            if (filters.priceRange) {
                filteredTours = filteredTours.filter(tour =>
                    tour.fromPrice >= filters.priceRange.min && tour.fromPrice <= filters.priceRange.max
                );
            }

            console.log(`Found ${filteredTours.length} matching tours`);

            if (filteredTours.length === 0) {
                console.log("No matches with province filter, trying keyword-only search");
                const keywordOnlyTours = toursToFilter.filter(tour =>
                    normalizeText(tour.name).includes(normalizedKeyword)
                );

                if (keywordOnlyTours.length > 0) {
                    console.log(`Found ${keywordOnlyTours.length} tours by keyword only`);
                    setTours(keywordOnlyTours);
                    return;
                }

                setError(`Không tìm thấy tour nào cho "${keyword}"`);
                setTours([]);
            } else {
                setTours(filteredTours);
            }
        } catch (error: any) {
            console.error('Lỗi khi tìm kiếm tour:', error);
            setError(error.message || 'Không tải được danh sách tour');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setError('Vui lòng nhập từ khóa tìm kiếm');
            return;
        }
        setHasSearched(true);
        setSearchTrigger(prev => prev + 1);
    };

    const handleBack = () => {
        router.back();
    };

    const toggleFavorite = (id: string) => {
        setTours(
            tours.map((tour) =>
                tour.id === id ? { ...tour, isFavorite: !tour.isFavorite } : tour
            )
        );
    };

    const handleTourPress = (tour: TourItem) => {
        router.push({
            pathname: '/(screens)/detail/[detailID]',
            params: {
                detailID: tour.id,
                provinceIds: JSON.stringify(tour.provinceIds),
            },
        });
    };

    const handleSuggestionPress = (province: ProvinceType) => {
        console.log(`Selected province: ${province.name} (ID: ${province.id})`);

        setSearchQuery(province.name);
        setSelectedProvinceId(province.id.toString());
        setSuggestions([]);
        setHasSearched(true);
        searchTours(province.id.toString(), province.name);
    };

    const handleApplyFilters = (filters: any) => {
        searchTours(selectedProvinceId, searchQuery, filters);
    };

    useEffect(() => {
        if (hasSearched && searchQuery.trim()) {
            searchTours(selectedProvinceId, searchQuery);
        }
    }, [searchTrigger]);

    const renderTourItem = ({ item }: { item: TourItem }) => (
        <TouchableOpacity style={styles.ContainerItem} onPress={() => handleTourPress(item)}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.featuredImageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => {
                        setTours(
                            tours.map((tour) =>
                                tour.id === item.id ? { ...tour, featuredImageUrl: '' } : tour
                            )
                        );
                    }}
                />
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(item.id)}
                >
                    <Heart
                        size={22}
                        color="#fff"
                        fill={item.isFavorite ? '#FF3B30' : 'transparent'}
                        stroke={item.isFavorite ? '#FF3B30' : '#fff'}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.title} numberOfLines={2}>
                {item.name}
            </Text>
            <View style={styles.ratingContainer}>
                <AntDesign
                    name="staro"
                    size={15}
                    color={item.vote > 0 ? '#FF9500' : '#999999'}
                />
                <Text style={styles.reviews}>({item.vote})</Text>
            </View>
            <Text style={styles.price}>Từ {item.fromPrice.toLocaleString()}đ/Người</Text>
        </TouchableOpacity>
    );

    const renderSuggestionItem = ({ item }: { item: ProvinceType }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSuggestionPress(item)}
        >
            <FontAwesome6 name="location-dot" size={16} color="#f97316" style={styles.suggestionIcon} />
            <Text style={styles.suggestionText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <View style={styles.searchResultContainer}>
                    <View style={styles.searchWrapper}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <AntDesign name="arrowleft" size={24} color="#000" />
                        </TouchableOpacity>
                        <View style={styles.searchContainer}>
                            <FontAwesome6 name="location-dot" size={20} color="#f97316" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Bạn muốn đi đâu ?"
                                placeholderTextColor="#888"
                                value={searchQuery}
                                onChangeText={(text) => {
                                    setSearchQuery(text);
                                    if (text.trim()) {
                                        fetchProvinceSuggestions(text);
                                    } else {
                                        setSuggestions([]);
                                        setHasSearched(false);
                                        setTours([]);
                                    }
                                }}
                                onSubmitEditing={handleSearch}
                            />
                            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                                <AntDesign name="search1" size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                        {hasSearched && tours.length > 0 && (
                            <TouchableOpacity
                                style={styles.filterButtonIcon}
                                onPress={() => setIsFilterModalVisible(true)} // Correctly show the modal
                            >
                                <SlidersHorizontal size={20} color="#888" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {loading ? (
                        <Text style={styles.loadingText}>Đang tải...</Text>
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : hasSearched && tours.length > 0 ? (
                        <>
                            <Text style={styles.resultSummary}>
                                Có {tours.length} kết quả tour {searchQuery}
                            </Text>
                            <FlatList
                                data={showAll ? tours : tours.slice(0, 6)}
                                renderItem={renderTourItem}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                contentContainerStyle={styles.listContainer}
                                ListFooterComponent={
                                    !showAll && tours.length > 6 ? (
                                        <TouchableOpacity
                                            style={styles.loadMoreButton}
                                            onPress={() => setShowAll(true)}
                                        >
                                            <Text style={styles.loadMoreText}>Xem thêm</Text>
                                        </TouchableOpacity>
                                    ) : null
                                }
                            />
                        </>
                    ) : (
                        <>
                            {searchQuery.trim() && suggestions.length > 0 && (
                                <FlatList
                                    data={suggestions}
                                    renderItem={renderSuggestionItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    style={styles.suggestionList}
                                />
                            )}
                            {(!searchQuery.trim() || (hasSearched && tours.length === 0)) && (
                                <Text style={styles.infoText}>
                                    {hasSearched ? 'Không tìm thấy tour nào.' : 'Vui lòng nhập từ khóa để tìm kiếm.'}
                                </Text>
                            )}
                        </>
                    )}
                </View>

                {/* Add SearchFilters Modal */}
                <SearchFilters
                    visible={isFilterModalVisible}
                    onClose={() => setIsFilterModalVisible(false)}
                    onApply={handleApplyFilters}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    searchResultContainer: {
        flex: 1,
        marginTop: 25,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
        marginTop: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 10,
        elevation: 2,
        flex: 1,
        marginTop: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 43,
        fontSize: 13,
        color: '#000',
        fontFamily: 'Inter-Medium',
    },
    searchButton: {
        backgroundColor: '#ff6200',
        borderRadius: 255,
        padding: 9,
    },
    filterButtonIcon: {
        marginLeft: 10,
        padding: 9,
        marginTop: 20,
    },
    errorText: {
        fontSize: 12,
        color: '#FF3B30',
        textAlign: 'center',
        marginVertical: 10,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginVertical: 10,
    },
    loadingText: {
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
        marginVertical: 10,
    },
    ContainerItem: {
        width: (Dimensions.get('window').width - 40) / 2,
        margin: 5,
        marginBottom: 15,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 220,
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 12,
        marginBottom: 3,
        color: '#333',
        fontFamily: 'Inter-Medium',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    reviews: {
        fontSize: 10,
        color: '#8E8E93',
        fontFamily: 'Inter-Medium',
    },
    price: {
        fontSize: 12,
        color: '#333',
        fontFamily: 'Inter-Medium',
    },
    listContainer: {
        paddingVertical: 5,
    },
    loadMoreButton: {
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'center',
    },
    loadMoreText: {
        color: '#FF9500',
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    resultSummary: {
        fontSize: 12,
        color: '#000',
        marginVertical: 10,
        fontFamily: 'Inter-Medium',
    },
    suggestionList: {
        marginTop: 5,
        maxHeight: 200,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    suggestionIcon: {
        marginRight: 10,
    },
    suggestionText: {
        fontSize: 13,
        color: '#333',
        fontFamily: 'Inter-Medium',
    },
});

export default SearchResult;