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
      paddingTop: 100,
      paddingBottom: 0,
      justifyContent: "space-between",
    },
    logo: {
      width: width * 0.5,
      height: height * 0.15,
      marginBottom: "auto",
    },
    formContainer: {
      width: "100%",
      height: "75%",
      backgroundColor: "white",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingHorizontal: 25,
      paddingTop: 25,
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
      fontFamily:'Mulish-Black',
      marginBottom: 25,
      color: "#000",
      alignSelf: "center",
    },
    phoneInputField: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: 43,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 25,
      marginBottom: 15,
      paddingLeft: 5,
      paddingRight: 15,
    },
    countryCodeContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      height: "100%",
    },
    countryCodeText: {
      fontSize: 16,
      marginRight: 2,
      color: "#333",
    },
    phoneInput: {
      flex: 1,
      height: "100%",
      fontSize: 16,
      paddingHorizontal: 10,
      color: "#333",
      fontFamily:'Inter-Medium'
    },
    loginButton: {
      width: "100%",
      height: 43,
      backgroundColor: "#FF5722",
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
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
      fontSize: 14,
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
      paddingHorizontal: 15,
    },
    socialIconContainer: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    socialButtonText: {
      fontSize: 13,
      color: "#333",
      flex: 1,
      textAlign: "center",
      paddingRight:40,
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
      fontFamily:'Inter-Medium'
    },
  })

  export default styles
