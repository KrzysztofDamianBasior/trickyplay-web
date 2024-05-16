import { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";

type Props = {
  initialText: string;
  submitLabel: string;
  onSubmitCallback: (commentContent: string) => void;
  onCancelCallback: () => void;
  hasCancelButton: boolean;
  disabled: boolean;
};

const CommentForm = ({
  initialText = "",
  submitLabel,
  onCancelCallback,
  onSubmitCallback,
  hasCancelButton = false,
  disabled,
}: Props) => {
  const [text, setText] = useState<string>(initialText);

  const maxNumOfWords: number = import.meta.env.VITE_MAX_NUM_OF_COMMENT_LETTERS
    ? parseInt(import.meta.env.VITE_MAX_NUM_OF_COMMENT_LETTERS)
    : 300;

  const minNumOfWords: number = import.meta.env.VITE_MIN_NUM_OF_COMMENT_LETTERS
    ? parseInt(import.meta.env.VITE_MIN_NUM_OF_COMMENT_LETTERS)
    : 300;

  const isInputInvalid: boolean =
    text.length > maxNumOfWords || text.length < minNumOfWords;

  const inputMessage: string = `The current word count is ${text.length}. Acceptable range: from ${minNumOfWords} to ${maxNumOfWords} words.`;

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setText("");
    if (!isInputInvalid) {
      onSubmitCallback(text);
    }
  };

  const handleCancel = () => {
    setText("");
    onCancelCallback();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Express your opinions"
        variant="outlined"
        color="secondary"
        disabled={disabled}
        fullWidth
        multiline
        rows={4}
        error={isInputInvalid}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          setText(event.target.value)
        }
        value={text}
        helperText={inputMessage}
      />
      {hasCancelButton && text.length > 0 && (
        <Button
          variant="contained"
          disabled={disabled}
          onClick={handleCancel}
          color="secondary"
          size="medium"
          type="button"
          endIcon={<CancelIcon />}
          sx={{ m: 1 }}
        >
          Cancel
        </Button>
      )}
      <Button
        variant="contained"
        disabled={isInputInvalid || disabled}
        color="secondary"
        size="medium"
        onClick={handleSubmit}
        type="submit"
        endIcon={<SendIcon />}
        sx={{ m: 1 }}
      >
        {submitLabel}
      </Button>
    </form>
  );
};

export default CommentForm;
