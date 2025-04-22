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
    backgroundColor: "#D1D5DB", // gray-300
    borderRadius: 9999,
    marginLeft: 16,
    overflow: "hidden",
    flexDirection: "row",
  },
  progressFill: {
    width: "100%",
    backgroundColor: "#F97316", // orange-500
  },
  title: {
    fontFamily: "Mulish-Black",
    fontSize: 24,
    color: "black",
    marginTop: 40,
    marginBottom: 30,
  },
  listContainer: {
    flex: 1,
  },
  hobbyItem: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hobbyIcon: {
    width: 24,
    height: 24,
  },
  hobbyText: {
    fontFamily: "Mulish-Extra",
    fontSize: 16,
    color: "black",
    marginLeft: 14,
  },
  toggleBtn: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  toggleText: {
    color: "black",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  buttonWrapper: {
    paddingBottom: 64,
    fontFamily:"Inter-Medium",
  },
});

export default styles;
