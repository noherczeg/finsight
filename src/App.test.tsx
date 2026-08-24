import { render, screen } from "@testing-library/react";
import App from "./App.tsx";

describe("App", () => {
    it("renders the finsight hero headline", () => {
        render(<App />);
        expect(screen.getByRole("heading", { level: 1, name: /see the money/i })).toBeInTheDocument();
    });

    it("renders the primary call to action", () => {
        render(<App />);
        expect(screen.getByRole("link", { name: /start exploring/i })).toBeInTheDocument();
    });

    it("lists the learning scenarios", () => {
        render(<App />);
        expect(screen.getByText(/compound interest lab/i)).toBeInTheDocument();
        expect(screen.getByText(/portfolio sandbox/i)).toBeInTheDocument();
        expect(screen.getByText(/market crash drills/i)).toBeInTheDocument();
    });
});
