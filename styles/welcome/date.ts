import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  progressWrapper: {
    width: "80%",
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 9999,
    marginLeft: 16,
    overflow: "hidden",
    flexDirection: "row",
  },
  progressFill: {
    width: "66.666667%",
    backgroundColor: "#F97316",
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    fontFamily: "Mulish-Black",
    fontSize: 24,
    color: "black",
  },
  subtitle: {
    fontFamily: "Mulish-Extra",
    fontSize: 16,
    color: "black",
    marginTop: 4,
  },
  question: {
    fontFamily: "Mulish-Black",
    fontSize: 24,
    color: "black",
    paddingTop: 100,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 9999,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 32,
  },
  dateText: {
    fontSize: 16,
  },
});
export default styles;
