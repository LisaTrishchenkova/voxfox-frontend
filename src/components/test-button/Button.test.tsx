import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button component", () => {
  it("рендерится с правильным текстом", () => {
    render(<Button>Нажми меня</Button>);

    const button = screen.getByText("Нажми меня");
    expect(button).toBeInTheDocument();
  });

  it("вызывает onClick при клике", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Кликни</Button>);

    const button = screen.getByText("Кликни");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("применяет правильный вариант стиля", () => {
    render(<Button variant="danger">Опасная кнопка</Button>);

    const button = screen.getByText("Опасная кнопка");
    expect(button).toHaveClass("btn-danger");
  });

  it("не вызывает onClick когда disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Отключено
      </Button>,
    );

    const button = screen.getByText("Отключено");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });
});
