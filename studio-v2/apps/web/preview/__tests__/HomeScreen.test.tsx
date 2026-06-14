import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "../src/screens/HomeScreen";

describe("HomeScreen", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
