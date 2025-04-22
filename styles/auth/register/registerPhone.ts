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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
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
  input: {
    fontFamily: "Inter-Medium",
    height: 43,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
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
});
export default styles;
