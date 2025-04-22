"use client";

import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

type SenderType = "user" | "ai";

interface Message {
  id: number;
  sender: SenderType;
  text: string;
  avatar: any;
}

interface Destination {
  id: number;
  name: string;
  image: any;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Xin chào, tôi là Gbalo, trợ lý du lịch của bạn. Tôi có thể giúp bạn tìm kiếm giá khách sạn, tour, giới thiệu khách sạn hoặc trả lời bất kỳ câu hỏi nào liên quan đến du lịch.",
      avatar: require("../../assets/images/AI.png"),
    },
    {
      id: 2,
      sender: "ai",
      text: "Bạn muốn đi đâu?",
      avatar: require("../../assets/images/AI.png"),
    },
    {
      id: 3,
      sender: "user",
      text: "Tôi muốn đi Hà Nội\nDu lịch khoảng 4 ngày",
      avatar: require("../../assets/images/react-logo.png"),
    },
    {
      id: 4,
      sender: "ai",
      text: "Được rồi! Tôi đã xem xét và lựa chọn 3 Tour có chi phí tốt nhất tại Hà Nội dành cho bạn. Đảm bảo bạn sẽ hài lòng ngay",
      avatar: require("../../assets/images/AI.png"),
    },
    {
      id: 5,
      sender: "user",
      text: "Hãy gợi ý cho tôi một số tour Đà Nẵng",
      avatar: require("../../assets/images/react-logo.png"),
    },
  ]);

  const destinations: Destination[] = [
    {
      id: 1,
      name: "Tour Đà Nẵng Bà Nà Hills Hội An",
      image: require("../../assets/images/image2.png"),
    },
    {
      id: 2,
      name: "Tour Đà Nẵng Cù Lao Chàm Ngũ Hành Sơn (2N1Đ)",
      image: require("../../assets/images/image2.png"),
    },
    {
      id: 3,
      name: "Tour Đà Nẵng Huế Hội An Bà Nà (4N3Đ)",
      image: require("../../assets/images/image2.png"),
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: message,
        avatar: require("../../assets/images/react-logo.png"),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const renderDestinationCard = (destination: Destination) => (
    <View key={destination.id} style={styles.cardHorizontal}>
      <Image source={destination.image} style={styles.cardHorizontalImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{destination.name}</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Trợ lý AI</Text>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {messages.map((msg, index) => {
            const showAvatar =
              index === 0 || messages[index - 1].sender !== msg.sender;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageContainer,
                  msg.sender === "user" ? styles.alignRight : styles.alignLeft,
                ]}
              >
                {showAvatar && msg.sender === "ai" && (
                  <Image source={msg.avatar} style={styles.avatar} />
                )}
                <View style={styles.bubble}>
                  <Text>{msg.text}</Text>
                </View>
                {showAvatar && msg.sender === "user" && (
                  <Image source={msg.avatar} style={styles.avatar} />
                )}
              </View>
            );
          })}

          {/* Destination Cards */}
          {messages[messages.length - 2]?.sender === "ai" &&
            messages[messages.length - 1]?.sender === "user" && (
              <View style={styles.destinationContainer}>
                <Image
                  source={require("../../assets/images/AI.png")}
                  style={styles.avatar}
                />
                <View style={styles.destinationCardBox}>
                  {destinations.map(renderDestinationCard)}
                </View>
              </View>
            )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <FontAwesome name="send" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 50,
    marginTop: 28,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
  },
  alignLeft: {
    justifyContent: "flex-start",
  },
  alignRight: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    marginHorizontal: 8,
  },
  bubble: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    maxWidth: "70%",
  },
  destinationContainer: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "flex-start",
  },
  destinationCardBox: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#FFF9F2",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFE8CC",
    gap: 8,
  },
  card: {
    width: 255,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 90,
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    padding: 8,
  },
  cardButton: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#FF5722",
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    borderRadius: 6,
    margin: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderRadius: 9999,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cardHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
    marginBottom: 12,
  },

  cardHorizontalImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },

  cardContent: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  bookButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#FF5722",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
