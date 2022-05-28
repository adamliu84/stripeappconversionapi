import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {ContextView} from "@stripe/ui-extension-sdk/ui";

import DashboardOverView from "./DashboardOverView";

describe("DashboardOverView", () => {
  it("renders ContextView", () => {
    const {wrapper} = render(<DashboardOverView {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
