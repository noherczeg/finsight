import { render, screen, fireEvent, within } from "@testing-library/react";
import { PortfolioSandbox } from "./PortfolioSandbox.tsx";
import { PortfolioSandboxPage } from "./LabPage.tsx";

function num(s: string | null | undefined): number {
  return Number((s ?? "").replace(/[^0-9.-]/g, ""));
}

/** The font-mono value rendered next to a Stat label. */
function statValue(label: string): number {
  const el = screen.getByText(label).parentElement as HTMLElement;
  return num(el.querySelector(".font-mono")?.textContent);
}

function openLens(name: RegExp) {
  fireEvent.click(screen.getByRole("tab", { name }));
}

describe("PortfolioSandbox — shared mix panel", () => {
  it("shows live expected return and volatility for the mix", () => {
    render(<PortfolioSandbox />);
    expect(screen.getByText("Expected return")).toBeInTheDocument();
    expect(screen.getByText("Volatility (risk)")).toBeInTheDocument();
    expect(statValue("Expected return")).toBeGreaterThan(0);
  });

  it("raises expected return when the stock weight rises", () => {
    render(<PortfolioSandbox />);
    const before = statValue("Expected return");
    fireEvent.change(screen.getByLabelText("Stocks"), {
      target: { value: "100" },
    });
    expect(statValue("Expected return")).toBeGreaterThan(before);
  });

  it("lowers volatility when correlation drops", () => {
    render(<PortfolioSandbox />);
    const before = statValue("Volatility (risk)");
    fireEvent.change(screen.getByLabelText("Correlation"), {
      target: { value: "-0.3" },
    });
    expect(statValue("Volatility (risk)")).toBeLessThan(before);
  });
});

describe("PortfolioSandbox — personalities lens (predict-first)", () => {
  it("hides asset names until revealed", () => {
    render(<PortfolioSandbox />);
    expect(screen.getByText("Mystery A")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /reveal names/i }));
    expect(screen.queryByText("Mystery A")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /hide names/i }),
    ).toBeInTheDocument();
  });
});

describe("PortfolioSandbox — diversification lens", () => {
  it("shows a risk-reduced figure that grows as correlation falls", () => {
    render(<PortfolioSandbox />);
    openLens(/diversify/i);
    const before = statValue("Risk reduced by");
    fireEvent.change(screen.getByLabelText("Correlation"), {
      target: { value: "-0.3" },
    });
    expect(statValue("Risk reduced by")).toBeGreaterThan(before);
  });
});

describe("PortfolioSandbox — sharpe lens", () => {
  it("shows a Sharpe ratio that responds to the mix", () => {
    render(<PortfolioSandbox />);
    openLens(/sharpe/i);
    expect(screen.getByText("Sharpe ratio")).toBeInTheDocument();
    expect(screen.getByText(/reward per unit of risk/i)).toBeInTheDocument();
  });
});

describe("PortfolioSandbox — fees & inflation lens", () => {
  it("lowers the after-fee outcome when the fee rises", () => {
    render(<PortfolioSandbox />);
    openLens(/fees/i);
    const before = statValue("After fees");
    fireEvent.change(screen.getByLabelText(/fund fee/i), {
      target: { value: "0.02" },
    });
    expect(statValue("After fees")).toBeLessThan(before);
  });

  it("lowers the real value when inflation rises", () => {
    render(<PortfolioSandbox />);
    openLens(/fees/i);
    const before = statValue("Worth today (real)");
    fireEvent.change(screen.getByLabelText("Inflation"), {
      target: { value: "8" },
    });
    expect(statValue("Worth today (real)")).toBeLessThan(before);
  });
});

describe("PortfolioSandbox — Monte Carlo cone (predict-first gate)", () => {
  it("hides the cone until a guess is committed", () => {
    render(<PortfolioSandbox />);
    openLens(/monte carlo/i);
    expect(screen.getByText(/commit a guess/i)).toBeInTheDocument();
    expect(screen.queryByText("Median (p50)")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /reveal the cone/i }));
    expect(screen.getByText("Median (p50)")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /simulated futures/i }),
    ).toBeInTheDocument();
  });
});

describe("PortfolioSandbox — time machine lens", () => {
  it("replays the mix through a chosen historical start", () => {
    render(<PortfolioSandbox />);
    openLens(/time machine/i);
    fireEvent.click(
      screen.getByRole("button", { name: /1973 — stagflation/i }),
    );
    expect(screen.getByRole("img", { name: /from 1973/i })).toBeInTheDocument();
    expect(screen.getByText("Ending balance")).toBeInTheDocument();
  });
});

describe("PortfolioSandbox — behavior lens", () => {
  it("compares DCA against a lump sum", () => {
    render(<PortfolioSandbox />);
    openLens(/behavior/i);
    expect(screen.getByText("Lump sum (all at once)")).toBeInTheDocument();
    expect(screen.getByText("Dollar-cost averaged")).toBeInTheDocument();
  });

  it("shows the cost of selling the dip in the panic drill", () => {
    render(<PortfolioSandbox />);
    openLens(/behavior/i);
    fireEvent.click(screen.getByRole("button", { name: /sell to cash/i }));
    expect(screen.getByText(/locked in the loss/i)).toBeInTheDocument();
    expect(screen.getByText("If you held on")).toBeInTheDocument();
  });
});

describe("PortfolioSandboxPage — framing", () => {
  it("carries a not-financial-advice disclaimer and a back link", () => {
    render(<PortfolioSandboxPage />);
    expect(screen.getByText(/not financial advice/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to finsight/i }),
    ).toBeInTheDocument();
  });

  it("recommends no specific allocation on load", () => {
    render(<PortfolioSandboxPage />);
    expect(
      screen.getByText(/no.*allocation is suggested/i),
    ).toBeInTheDocument();
  });

  it("formats currency for the chosen locale", () => {
    render(<PortfolioSandbox />);
    openLens(/fees/i);
    const usd = within(
      screen.getByText("After fees").parentElement as HTMLElement,
    ).getByText(/\$/);
    expect(usd).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Currency"), {
      target: { value: "eu" },
    });
    expect(
      within(
        screen.getByText("After fees").parentElement as HTMLElement,
      ).getByText(/€/),
    ).toBeInTheDocument();
  });
});
