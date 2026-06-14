import React from "react";
import { render } from "@testing-library/react-native";
import ExplorerScreen from "../src/screens/ExplorerScreen";

describe("ExplorerScreen", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<ExplorerScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<ExplorerScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
