import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  topHalf: {
    height: height * 0.35,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomHalf: {
    height: height * 0.75,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  title: {
    fontFamily: "Mulish-ExtraBold",
    fontSize: 30,
    color: "black",
    textAlign: "center",
    margin: 10,
  },
  inputLabel: {
    fontFamily: "Inter-ExtraBold",
    fontSize: 13,
    color: "black",
    marginBottom: 6,
  },
  required: {
    color: "red",
  },
  input: {
    fontFamily: "Inter-Medium",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  infoText: {
    fontFamily: "Inter-Medium",
    fontSize: 10,
    color: "black",
    marginBottom: 16,
  },
  privacyPolicy: {
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
    marginBottom: 15,
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
