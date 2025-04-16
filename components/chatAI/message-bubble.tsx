import type React from "react";
import { View, Text, Image } from "react-native";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  avatar: any;
}

interface MessageBubbleProps {
  message: Message;
  showAvatar: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showAvatar }) => {
  const isUser = message.sender === "user";

  return (
    <View className={`flex-row mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <View className={`${isUser ? "flex-row-reverse" : "flex-row"} items-center`}>
        {/* Avatar cho AI */}
        {!isUser && showAvatar && (
          <Image source={message.avatar} className="w-10 h-10 rounded-full mr-2" />
        )}

        {/* Avatar cho User */}
        {isUser && showAvatar && (
          <View className="w-10 h-10 rounded-full bg-[#4F6AFF] justify-center items-center ml-2">
            <Text className="text-white text-base font-bold">T</Text>
          </View>
        )}

        {/* Nội dung tin nhắn */}
        <View
          className={`max-w-[75%] p-3 rounded-2xl ${
            isUser ? "bg-[#F0F7FF] border border-[#D6E8FF]" : "bg-[#FFF9F2] border border-[#FFE8CC]"
          }`}
          style={{
            marginTop: showAvatar ? 12 : 0, // Add marginTop to align message below avatar
            marginLeft: !isUser && !showAvatar ? 48 : 0, // Adjust for no AI avatar
            marginRight: isUser && !showAvatar ? 48 : 0, // Adjust for no user avatar
          }}
        >
          <Text className="text-sm leading-5 text-black">{message.text}</Text>
        </View>
      </View>
    </View>
  );
};