import type React from "react"
import { View, Text, Image, TouchableOpacity } from "react-native"

interface Destination {
  id: number
  name: string
  image: any
}

interface DestinationCardProps {
  destination: Destination
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <View className="flex-row mb-3 bg-white rounded-lg overflow-hidden border border-gray-100">
      <Image source={destination.image} className="w-20 h-[60px] object-cover" />
      <View className="flex-1 flex-row justify-between items-center px-3">
        <Text className="text-sm font-medium">{destination.name}</Text>
        <TouchableOpacity className="bg-[#FF6B00] px-3 py-1.5 rounded">
          <Text className="text-white text-xs font-medium">Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
