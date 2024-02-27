import axios from 'axios';
import { JSDOM } from 'jsdom';

export const checkSolved = async (problemNum, backjoonId) => {
    const url = `https://www.acmicpc.net/status?from_mine=1&problem_id=${problemNum}&user_id=${backjoonId}`;

    const isSolved = axios
        .get(url, {
            headers: {
                Accept: 'application/json',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            },
        })
        .then((response) => {
            const htmlSnippet = response.data;
            const dom = new JSDOM(htmlSnippet);
            const document = dom.window.document;

            const resultElements = document.querySelectorAll('.result-text');

            for (const resultElement of resultElements) {
                if (resultElement.textContent.includes('맞았습니다!!')) {
                    return true;
                }
            }
            return false;
        })
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });

    return isSolved;
};
