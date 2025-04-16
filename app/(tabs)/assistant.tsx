"use client"

import { useState } from "react"
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
} from "react-native"
import { DestinationCard } from "../../components/chatAI/destination-card"
import { MessageBubble } from "../../components/chatAI/message-bubble"
import FontAwesome from "react-native-vector-icons/FontAwesome"

// ✅ Khai báo type ở đây để tránh lỗi TS
type SenderType = "user" | "ai"

interface Message {
  id: number
  sender: SenderType
  text: string
  avatar: any
}

export default function Home() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Xin chào, tôi là Gbao, trợ lý du lịch của bạn. Tôi có thể giúp bạn tìm kiếm giá khách sạn, tour, giới thiệu khách sạn hoặc trả lời bất kỳ câu hỏi nào liên quan đến du lịch.",
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
      text: "Tôi muốn đi Hà Nội\nDu lịch khoảng 4 ngày",
      avatar: require("../../assets/images/react-logo.png"),
    },
  ])

  const destinations = [
    {
      id: 1,
      name: "TP Hồ Chí Minh",
      image: require("../../assets/images/image2.png"),
    },
    {
      id: 2,
      name: "Đà Nẵng",
      image: require("../../assets/images/image2.png"),
    },
    {
      id: 3,
      name: "Hà Nội",
      image: require("../../assets/images/image2.png"),
    },
  ]

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: message,
        avatar: require("../../assets/images/react-logo.png"),
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="h-[50px] mt-7 justify-center items-center border-b border-gray-100">
        <Text className="text-lg font-semibold">Trợ lý AI</Text>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-4" contentContainerClassName="py-4">
          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              showAvatar={index === 0 || messages[index - 1].sender !== msg.sender}
            />
          ))}

          {/* Destination Cards - shown after the last AI message */}
          {messages[messages.length - 2]?.sender === "ai" &&
            messages[messages.length - 1]?.sender === "user" && (
              <View className="flex-row mt-4 mb-2">
                <Image source={require("../../assets/images/AI.png")} className="w-10 h-10 rounded-full mr-2" />
                <View className="flex-1 bg-[#FFF9F2] rounded-2xl p-3 border border-[#FFE8CC]">
                  {destinations.map((destination) => (
                    <DestinationCard key={destination.id} destination={destination} />
                  ))}
                </View>
              </View>
            )}
        </ScrollView>

        {/* Message Input */}
        <View className="flex-row items-center px-4 py-2 border-t border-gray-100 bg-white">
          <TextInput
            className="flex-1 border border-gray-100 rounded-full px-4 bg-white "
            placeholder="Nhập"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity className="ml-2 w-10 h-10 justify-center items-center" onPress={handleSend}>
            <FontAwesome name="send" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
