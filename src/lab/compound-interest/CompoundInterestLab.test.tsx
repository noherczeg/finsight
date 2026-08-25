import { render, screen, fireEvent, within } from "@testing-library/react";
import { CompoundInterestLab } from "./CompoundInterestLab.tsx";
import { CompoundInterestLabPage } from "./LabPage.tsx";

function chooseRate(value = 7) {
  fireEvent.change(screen.getByLabelText("Interest rate"), {
    target: { value: String(value) },
  });
}

function balanceCard(): HTMLElement {
  return screen.getByText(/projected balance/i).parentElement as HTMLElement;
}

describe("CompoundInterestLab — no default rate", () => {
  it("shows no projection and prompts for a rate on load", () => {
    render(<CompoundInterestLab />);
    expect(screen.getByText(/pick an interest rate/i)).toBeInTheDocument();
    expect(screen.queryByText(/projected balance/i)).not.toBeInTheDocument();
  });

  it("reveals the curve and projected balance once a rate is chosen", () => {
    render(<CompoundInterestLab />);
    chooseRate(7);
    expect(screen.getByText(/projected balance/i)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /balance grows/i }),
    ).toBeInTheDocument();
  });
});

describe("CompoundInterestLab — sliders drive the projection", () => {
  it("changes the projected balance when a control changes", () => {
    render(<CompoundInterestLab />);
    chooseRate(7);
    const before = balanceCard().textContent ?? "";

    fireEvent.change(screen.getByLabelText("Monthly contribution"), {
      target: { value: "1000" },
    });
    expect(balanceCard().textContent).not.toEqual(before);
  });
});

describe("CompoundInterestLab — inflation / real value", () => {
  it("shows a real (today's money) figure that responds to the inflation slider", () => {
    render(<CompoundInterestLab />);
    chooseRate(7);
    const realCard = () =>
      screen.getByText(/worth today/i).parentElement as HTMLElement;
    expect(realCard()).toBeInTheDocument();
    const before = realCard().textContent ?? "";

    fireEvent.change(screen.getByLabelText("Inflation"), {
      target: { value: "8" },
    });
    expect(realCard().textContent).not.toEqual(before);
  });
});

describe("CompoundInterestLab — locale currency", () => {
  it("formats monetary values with the chosen currency", () => {
    render(<CompoundInterestLab />);
    fireEvent.change(screen.getByLabelText("Currency"), {
      target: { value: "eu" },
    });
    chooseRate(7);
    const balanceCard = screen.getByText(/projected balance/i)
      .parentElement as HTMLElement;
    expect(within(balanceCard).getByText(/€/)).toBeInTheDocument();
  });
});

describe("CompoundInterestLabPage", () => {
  it("shows the not-financial-advice disclaimer", () => {
    render(<CompoundInterestLabPage />);
    expect(screen.getByText(/not\s+financial advice/i)).toBeInTheDocument();
  });

  it("offers a way back to the landing page", () => {
    render(<CompoundInterestLabPage />);
    const back = screen.getByRole("link", { name: /back to finsight/i });
    expect(back).toHaveAttribute("href", "#");
  });
});
