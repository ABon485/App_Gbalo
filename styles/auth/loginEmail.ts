import { StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

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
    paddingBottom: 0, // No bottom padding
    justifyContent: "space-between", // This will push content to top and bottom
  },
  logo: {
    width: width * 2,
    height: height * 0.15,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%", // Full width
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0, // Remove bottom radius
    borderBottomRightRadius: 0, // Remove bottom radius
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 20, // Add some padding at the bottom for content
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: "auto", // Push to bottom
  },
  title: {
    fontSize: 30,
    fontFamily:'Mulish-Black',
    marginBottom: 25,
    color: "#000",
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
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF5722",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily:'Inter-Black'
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
    paddingHorizontal: 15, // Add padding to control left spacing
  },
  socialIcon: {
    marginRight: 10, // Space between icon and text
  },
  
  socialButtonText: {
    fontSize: 13,
    color: "#333",
    flex: 1, // Take remaining space
    textAlign: "center", // Center the text horizontally
    paddingRight:25,
    fontFamily:'Inter-Medium',
  },
  // New styles for email login
  emailLoginContainer: {
    width: "100%",
    marginBottom: 10,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 43,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
    
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily:'Inter-Medium'
  },
  forgotPasswordContainer: {
    alignSelf: "center",
    marginBottom: 10,
  },
  forgotPasswordText: { 
    color: "#007AFF",
    fontSize: 14,
    paddingLeft:200,
    textDecorationLine: 'underline',
    fontFamily:'Inter-Medium'
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 10,
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
    fontFamily:'Inter-Medium'
  },
  socialIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,},
})

export default styles
