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
    marginTop: 24,
  },
  logo: {
    width: 120,
    height: 120,
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
    fontSize: 24,
    textAlign: "center",
    color: "black",
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F0",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
    flexWrap: "wrap",
  },
  label: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "black",
  },
  required: {
    color: "red",
  },
  input: {
    fontFamily: "Inter-Medium",
    height: 43,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 50,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    position: "relative",
  },
  inputWithIcon: {
    flex: 1,
    marginBottom: 0,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -9 }],
  },
  policyText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginTop: 8,
  },
  boldText: {
    fontFamily: "Inter-SemiBold",
    color: "black",
  },
});
export default styles;
