import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import App from "./App";
import mockFetch from "./mocks/mockFetch";
import userEvent from "@testing-library/user-event";

test("renders the landing page", async () => {
  render(<App />);

  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/)
  expect(screen.getByRole("combobox")).toHaveDisplayValue(/Select a breed/)
  // findBy queries are used when you need to test asynchronous code
  expect(await screen.findByRole("option", { name: "boxer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled()
  expect(screen.getByRole("img")).toBeInTheDocument();
});

beforeEach(() => {
  // jest.spyOn(object, methodName)
  jest.spyOn(window, "fetch").mockImplementation(mockFetch)
})

afterEach(() => {
  // jest.restoreAllMocks() only works for mocks created with jest.spyOn() and properties replaced with jest.replaceProperty()
  jest.restoreAllMocks();
})

test("should be able to search and display dog image results",async()=>{
  render(<App/>);

  //Simulate selecting an option and verifying its value

  const select = screen.getByRole("combobox");

  expect(await screen.findByRole("option",{name:"cattledog"})).toBeInTheDocument();

  userEvent.selectOptions(select,"cattledog");

  expect(select).toHaveValue("cattledog");

  const searchBtn = screen.getByRole("button",{name:"Search"});
  expect(searchBtn).not.toBeDisabled();
  userEvent.click(searchBtn);

  // Suggest using queryBy* queries when waiting for disappearance (testing-library/prefer-query-by-disappearance)
  // This rule enforces using queryBy* queries when waiting for disappearance with waitForElementToBeRemoved
  await waitForElementToBeRemoved(()=>screen.queryByText(/loading/i));

  const dogImages = screen.getAllByRole("img");
  expect(dogImages).toHaveLength(2);
  expect(screen.getByText(/2 results/i)).toBeInTheDocument();
  expect(dogImages[0]).toHaveAccessibleName("cattledog 1 of 2");
  expect(dogImages[1]).toHaveAccessibleName("cattledog 2 of 2");
})
