import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: "auto",
    marginTop: 10,
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
    fontFamily: "Inter-Black",
    fontSize: 30,
    color: "black",
    textAlign: "center",
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: "Inter-Black",
    fontSize: 16,
    color: "black",
  },
  required: {
    color: "red",
  },
  input: {
    fontFamily: "Inter-Medium",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 43,
    marginTop: 8,
    marginBottom: 16,
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
  dividerContainer: {
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
    marginLeft: 16,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginLink: {
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
});
export default styles;
