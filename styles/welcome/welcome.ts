import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  progressBarWrapper: {
    width: "80%",
    height: 6,
    backgroundColor: "#D1D5DB", // gray-300
    borderRadius: 9999,
    marginLeft: 16,
    overflow: "hidden",
    flexDirection: "row",
  },
  progressBarFill: {
    width: "33.3333%",
    backgroundColor: "#F97316", // orange-500
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    fontFamily: "Mulish-Black",
    fontSize: 24,
    color: "black",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "black",
  },
  question: {
    fontFamily: "Mulish-Black",
    fontSize: 24,
    color: "black",
    paddingTop: 100,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB", 
    borderRadius: 9999,
    marginBottom: 40,
    marginTop: 80,
    overflow: "hidden",
  },
  pickerPadding: {
    paddingHorizontal: 10,
  },
  picker: {
    height: 53,
    width: "100%",
  },
});

export default styles;
