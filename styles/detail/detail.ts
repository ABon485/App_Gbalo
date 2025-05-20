import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "rgb(255, 253, 253)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCartButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "rgb(255, 253, 253)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 150, 
  },
  iconShareButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "rgb(255, 253, 253)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  favoriteButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "rgb(255, 253, 253)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    fontFamily: "Inter-Medium",
  },
  subTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    fontFamily: "Inter-Medium",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // 👈 giúp icon không kéo text xuống
    marginBottom: 20,
  },

  icon: {
    marginTop: 2, // 👈 optional, can tweak for better vertical alignment
  },

  rating: {
    color: "#444",
    fontFamily: "Inter-Medium",
    marginLeft: 8,
    flex: 1, // 👈 để text chiếm phần còn lại
    flexWrap: "wrap", // 👈 cho phép xuống dòng
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    fontSize: 12,
    color: "#333",
    fontFamily: "Inter-Medium",
  },
  priceHighlight: {
    color: "#F24E1E",
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    marginLeft:10
  },
  description: {
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: "Inter-Medium",
  },
  bullet: {
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  includesContainer: {
    marginBottom: 10,
  },
  includeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  includeText: {
    marginLeft: 12,
    color: "#333",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  itineraryItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  itineraryIcon: {
    width: 30,
    alignItems: "center",
  },
  itineraryContent: {
    flex: 1,
    paddingLeft: 8,
  },
  itineraryText: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter-Medium",
  },
  requirementItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  requirementIcon: {
    width: 30,
    alignItems: "center",
  },
  requirementText: {
    flex: 1,
    paddingLeft: 8,
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter-Medium",
  },
  showMoreButton: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  showMoreText: {
    fontSize: 14,
    marginRight: 250,
    fontFamily: "Inter-Medium",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Inter-Medium",
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  button: {
    backgroundColor: "#F24E1E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
});
export default styles;
