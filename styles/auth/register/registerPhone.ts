import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: "auto",
    marginTop: 13,
  },
  formContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontFamily: "Mulish-ExtraBold",
    fontSize: 30,
    color: "black",
    textAlign: "center",
    margin: 10,
  },
  countryPhoneContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  countryPhoneHeader: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  countrySelectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
  },
  downIcon: {
    marginLeft: 8,
  },
  countryPhoneLabel: {
    fontFamily: "Inter-ExtraBold",
    fontSize: 13,
    color: "black",
  },
  countryPhoneText: {
    fontFamily: "Inter-Extra",
    fontSize: 15,
    color: "black",
  },
  countryPhoneDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 1,
  },
  
  input: {
    fontFamily: "Inter-Medium",
    borderColor: "#ddd",
  },
  privacyText: {
    fontFamily: "Inter-Medium",
    fontSize: 10,
    color: "black",
    marginBottom: 16,
  },
  privacyLink: {
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "black",
    marginHorizontal: 8,
  },
  socialButton: {
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  socialButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    marginLeft: 60,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginLinkText: {
    fontFamily: "Inter-Medium",
  },
  loginLink: {
    fontFamily: "Inter-Medium",
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Nền đen mờ
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    maxHeight: "70%",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  countryItemText: {
    fontSize: 16,
    color: "#333",
  },
});
export default styles;
