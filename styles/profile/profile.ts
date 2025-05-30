import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    marginHorizontal: 16,
    padding: 14,
    marginTop: 35,
  },
  profileHeader: {
    fontSize: 24,
    color: "#000",
    marginBottom: 5,
    fontFamily: "Inter-Medium",
    fontWeight: "bold",
    left: 10,
  },
  userInfo: {
    flexDirection: "row",
    marginBottom: 20,
  },
  userAvatar: {
    width: 84,
    height: 84,
    borderRadius: 52,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Inter-Medium",
  },
  userEmail: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "Inter",
    marginTop: 4,
  },
  updateProfileButton: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  updateProfileButtonContent: {
    flexDirection: "row",
    backgroundColor: "#E4EFE7",
    width: "110%",
  },
  updateProfileText: {
    fontSize: 14,
    color: "#007BFF",
    fontFamily: "Inter",
    left: 6,
  },
  pointsInfo: {
    flexDirection: "row",
    left: 10,
  },
  pointsText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
    fontFamily: "Inter-Medium",
  },
  iconWrapper: {
    marginLeft: 10,
    width: "15%",
    aspectRatio: 4 / 3,
    objectFit: "contain",
  },
  loginInfo: {
    flexDirection: "row",
    marginBottom: 20,
  },
  defaultAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  loginButtons: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 18,
  },
  loginButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginRight: 3,
    height: 30,
    width: 100,
  },
  registerButton: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderColor: "#FF5722",
    borderWidth: 1,
    height: 30,
    width: 100,
  },
  loginButtonText: {
    color: "white",
    fontSize: 13,
    fontFamily: "Inter-Medium",
  },
  registerButtonText: {
    color: "#FF5722",
    fontSize: 13,
    fontFamily: "Inter-Medium",
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 10,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    fontFamily: "Inter-Medium",
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  logoutButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  DeleteButton: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    textAlign: "center",
    justifyContent: "center",
  },
  DeleteAcount: {
    color: "#FF5722",
    fontSize: 14,
    fontFamily: "Inter",
    textDecorationLine: "underline",
  },
});
export default styles;
