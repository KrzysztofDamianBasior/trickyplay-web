import { useState } from "react";

import { TextField, Button } from "@mui/material";
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
  disabled,
  hasCancelButton = false,
}: Props) => {
  const [text, setText] = useState<string>(initialText);

  const maxNumOfWords: number = process.env.REACT_APP_MAX_NUM_OF_COMMENT_LETTERS
    ? parseInt(process.env.REACT_APP_MAX_NUM_OF_COMMENT_LETTERS)
    : 300;

  const minNumOfWords: number = process.env.REACT_APP_MIN_NUM_OF_COMMENT_LETTERS
    ? parseInt(process.env.REACT_APP_MIN_NUM_OF_COMMENT_LETTERS)
    : 300;

  const isInputInvalid: boolean =
    text.length > maxNumOfWords || text.length < minNumOfWords;
  const inputMessage: string = `The current word count is ${text.length}. Acceptable range: from ${minNumOfWords} to ${maxNumOfWords} words.`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
        label="Comment field"
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
      <Button
        variant="contained"
        disabled={isInputInvalid || disabled}
        color="secondary"
        size="medium"
        endIcon={<SendIcon />}
      >
        {submitLabel}
      </Button>
      ;
      {hasCancelButton && text.length > 0 && (
        <Button
          variant="contained"
          disabled={disabled}
          onClick={handleCancel}
          color="secondary"
          size="medium"
          type="button"
          endIcon={<CancelIcon />}
        >
          Cancel
        </Button>
      )}
    </form>
  );
};

export default CommentForm;
