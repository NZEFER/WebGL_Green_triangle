// Инициализация канваса и WebGL контекста
const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

// Проверка наличия WebGL
if (!gl) {
    alert('WebGL не поддерживается в этом браузере.');
}

// Вершинный шейдер
const vsSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

// Фрагментный шейдер
const fsSource = `
    void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);  // Зеленый цвет
    }
`;

// Функция компиляции шейдера
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Проверка на ошибки
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Ошибка компиляции шейдера:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Создание и компиляция шейдеров
const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);

// Создание программы шейдеров
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

// Проверка на ошибки
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Ошибка линковки программы шейдеров:', gl.getProgramInfoLog(shaderProgram));
}

// Используем программу шейдеров
gl.useProgram(shaderProgram);

// Данные для треугольника
const vertices = new Float32Array([
    0.0, 1, // Вершина 1 (вверх)
    -1, -1, // Вершина 2 (вниз слева)
    1, -1 // Вершина 3 (вниз справа)
]);

// Создание VBO (буфер вершин)
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Получаем аттрибуты из программы
const positionAttribLocation = gl.getAttribLocation(shaderProgram, "a_position");
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttribLocation);

// Устанавливаем чёрный фон
gl.clearColor(0.0, 0.0, 0.0, 1.0); // Черный цвет фона
gl.clear(gl.COLOR_BUFFER_BIT);

// Рисуем треугольник
gl.drawArrays(gl.TRIANGLES, 0, 3);

// Освобождаем ресурсы
gl.deleteBuffer(vertexBuffer);
gl.deleteProgram(shaderProgram);