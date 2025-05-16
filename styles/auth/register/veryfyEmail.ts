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
    marginTop: 90,
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
    color: "black",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  ShowEmail: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    textAlign: "center",
    color: "red",
    marginBottom: 15,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  otpInput: {
    borderColor: "#B0B0B0",
    borderWidth: 1,
    width: 48,
    height: 48,
    textAlign: "center",
    fontSize: 18,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#cccccc", 
    color: "#666666", 
  },

  activeButton: {
    backgroundColor: "#f97316", 
    color: "white", 
  },
  resendButton: {
    height: 43,
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  resendText: {
    fontFamily: "Inter-Black",
    fontSize: 14,
    color: "black",
  },
});
export default styles;
