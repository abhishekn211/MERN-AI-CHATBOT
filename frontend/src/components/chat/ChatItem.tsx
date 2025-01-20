import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
//import React from "react";

type MessagePart = {
  type: "text" | "code" | "bold";
  text?: string;
  code?: string;
  language?: string;
};

function extractCodeFromString(message: string): MessagePart[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: MessagePart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      const textBeforeCode = message.slice(lastIndex, match.index).trim();
      const textParts = processTextWithBold(textBeforeCode);
      parts.push(...textParts);
    }

    parts.push({
      type: "code",
      language: match[1] || "javascript",
      code: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < message.length) {
    const remainingText = message.slice(lastIndex).trim();
    const textParts = processTextWithBold(remainingText);
    parts.push(...textParts);
  }

  return parts.length > 0 ? parts : [{ type: "text", text: message }];
}

function processTextWithBold(text: string): MessagePart[] {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts: MessagePart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        text: text.slice(lastIndex, match.index)
      });
    }

    parts.push({
      type: "bold",
      text: match[1]
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      text: text.slice(lastIndex)
    });
  }

  return parts;
}

const renderContent = (part: MessagePart, role: "user" | "model") => {
  if (part.type === "code" && part.code) {
    return (
      <SyntaxHighlighter 
        style={coldarkDark} 
        language={part.language || "javascript"}
        customStyle={{ margin: "12px 0", fontSize: "14px" }}
      >
        {String(part.code)}
      </SyntaxHighlighter>
    );
  }

  return (
    <Typography 
      align="justify" 
      sx={{ 
        fontSize: "16px",
        whiteSpace: "pre-wrap",
        "& strong": { fontWeight: 600 },
        color: role === "user" ? "white" : "inherit",
        lineHeight: 1.5
      }}
    >
      {part.text || ""}
    </Typography>
  );
};

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "model";
}) => {
  const messageParts = extractCodeFromString(content);
  const auth = useAuth();

  return role == "model" ? (
    <Box
      sx={{
        display: "flex",
        p: 3,
        bgcolor: "#04181b",
        gap: 2,
        borderRadius: 2,
        alignSelf: "flex-start",
        maxWidth: "90%",
        marginRight: "auto",
        my: 2,
      }}
    >
      <Avatar sx={{ ml: "0" }}>
        <img src="openai.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box sx={{ width: "100%" }}>
        {messageParts.map((part, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            {renderContent(part, role)}
          </Box>
        ))}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        p: 2,
        alignItems: "center",
        bgcolor: "#004d56",
        gap: 2,
        borderRadius: 2,
        alignSelf: "flex-end",
        maxWidth: "75%",
        marginLeft: "auto",
        marginRight: "12px",
      }}
    >
      <Box 
        sx={{ 
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        {messageParts.map((part, index) => (
          <Box 
            key={index} 
            sx={{ 
              mb: part.type === "code" ? 2 : 1,
              "&:last-child": { mb: 0 }
            }}
          >
            {renderContent(part, role)}
          </Box>
        ))}
      </Box>
      <Avatar
        sx={{
          bgcolor: "white",
          color: "black",
          fontWeight: 700,
          height: 32,
          width: 32,
          alignSelf: "center"
        }}
      >
        {auth?.user?.name ? auth.user.name[0] : ""}
        {auth?.user?.name && auth.user.name.split(" ").length > 1
          ? auth.user.name.split(" ")[1][0]
          : ""}
      </Avatar>
    </Box>
  );
};

export default ChatItem;
