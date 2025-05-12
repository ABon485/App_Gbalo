import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: 80,
    paddingBottom: 0,
    justifyContent: "space-between",
  },
  logo: {
    width: width * 2,
    height: height * 0.15,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    height: "75%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 15,
    paddingTop: 15  ,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: "auto",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: "#000",
    fontFamily:'Mulish-Black',

  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 43,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "center",
    paddingRight:40,
    fontFamily:'Inter-Medium'
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    paddingHorizontal: 10,
    color: "#777",
    fontSize: 16,
    fontFamily:'Inter-Medium'
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 43,
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15, // Thêm padding để icon không sát mép
  },
  socialButtonText: {
    fontSize: 13,
    color: "#333",
    flex: 1, // Chiếm toàn bộ không gian còn lại
    textAlign: "center",
    paddingRight: 23 ,// Căn giữa chữ
    fontFamily:'Inter-Medium'
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: {
    fontSize: 13,
    color: "#333",
    fontFamily:'Inter-Medium'
  },
  registerLink: {
    fontSize: 13,
    color: "#007AFF",
    fontFamily:'Inter-Medium',
    textDecorationLine: 'underline',
  },
});

export default styles;