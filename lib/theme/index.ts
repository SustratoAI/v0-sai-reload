import { buttonTokens } from "./components/button-tokens";
import { cardTokens } from "./components/card-tokens";
import { checkTokens } from "./components/check-tokens";
import { inputTokens } from "./components/input-tokens";
import { selectTokens } from "./components/select-tokens";
import { textareaTokens } from "./components/textarea-tokens";
import { textTokens } from "./components/text-tokens";
import { navTokens } from "./components/nav-tokens";
import { colorTokens } from "./color-tokens";
import { sizeTokens } from "./size-tokens";

export const theme = {
  components: {
    button: buttonTokens,
    card: cardTokens,
    checkbox: checkTokens,
    input: inputTokens,
    select: selectTokens,
    textarea: textareaTokens,
    text: textTokens,
    navbar: navTokens,
  },
  color: colorTokens,
  size: sizeTokens,
};

export type Theme = typeof theme;
