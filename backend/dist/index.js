"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv").config();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log(process.env.OPENROUTER_API_KEY);
function chatCompletion() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const question = 'How would you build the tallest building ever?';
        const response = yield fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-distill-llama-70b:free",
                messages: [{ role: 'user', content: "create a simple todo app" }],
                stream: true,
            }),
        });
        const reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
        if (!reader) {
            throw new Error('Response body is not readable');
        }
        const decoder = new TextDecoder();
        let buffer = '';
        try {
            while (true) {
                const { done, value } = yield reader.read();
                if (done)
                    break;
                // Append new chunk to buffer
                buffer += decoder.decode(value, { stream: true });
                // Process complete lines from buffer
                while (true) {
                    const lineEnd = buffer.indexOf('\n');
                    if (lineEnd === -1)
                        break;
                    const line = buffer.slice(0, lineEnd).trim();
                    buffer = buffer.slice(lineEnd + 1);
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]')
                            break;
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0].delta.content;
                            if (content) {
                                console.log(content);
                            }
                        }
                        catch (e) {
                            // Ignore invalid JSON
                        }
                    }
                }
            }
        }
        finally {
            reader.cancel();
        }
    });
}
chatCompletion();
