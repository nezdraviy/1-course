window.addEventListener('load', main, false);
function main () {

    var canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    let neuron_in_siting = [];
    let neuron_hid_siting = [];
    let neuron_out_siting = [];

    const training_data = [
        { inputs: [0, 0], targets: [0] },
        { inputs: [0, 1], targets: [1] },
        { inputs: [1, 0], targets: [1] },
        { inputs: [1, 1], targets: [0] }
    ];

    class NeuralNetwork {
        constructor (inputs, hidden, output) {
            this.inputs = inputs;
            this.output = output;
            this.hidden = hidden;
            this.weigthIH = [];
            this.weigthHO = [];
            this.biasH = [];
            this.biasO = [];
            this.learningRate = 0.03;

            for (let i = 0; i < this.inputs; i++) {
                this.weigthIH[i] = [];
                for (let j = 0; j < this.hidden; j++) {
                    this.weigthIH[i][j] = Math.random() * 2 - 1;
                }
            }
            for (let i = 0; i < this.hidden; i++) {
                this.weigthHO[i] = [];
                this.biasH[i] = Math.random() * 2 - 1;
                for (let j = 0; j < this.output; j++) {
                    this.weigthHO[i][j] = Math.random() * 2 - 1;
                }
            }
            for (let i = 0; i < this.output; i++) {
                this.biasO[i] = Math.random() * 2 - 1;
            }
        }

        build () {
            let y0 = h / 2 - 150;
            for (let i = 0; i < this.inputs; i++) {
                y0 += 300 * i;
                neuron_in_siting.push({x: 200, y: y0});
            }
            y0 = h / 2 - 600;
            for (let i = 0; i < this.hidden; i++) {
                y0 += 300;
                neuron_hid_siting.push({x: 600, y: y0});
            }
            y0 = h / 2 - 100;
            for (let i = 0; i < this.output; i++) {
                y0 += 100;
                neuron_out_siting.push({x: 1000, y: y0});
            }

            return;
        }

        drawNeuron (ctx, x, y, layer) {
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.fillStyle = adjustColor("#FFFFFF", layer * (-255));
            ctx.arc(x, y, 40, 0, Math.PI*2);
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
        
        drawLines (input, hidden, output) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            for (let i = 0; i < neuron_in_siting.length; i++) {
                for (let j = 0; j < neuron_hid_siting.length; j++) {
                    // let l = Math.sqrt((neuron_hid_siting[j].x - neuron_in_siting[i].x)**2 + (neuron_hid_siting[j].y - neuron_in_siting[i].y)**2);
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    // ctx.moveTo(neuron_in_siting[i].x + ((Math.abs(neuron_hid_siting[j].x - neuron_in_siting[i].x) * 40) / l), neuron_in_siting[i].y + ((Math.abs(neuron_hid_siting[j].y - neuron_in_siting[i].y) * 40) / l));
                    // ctx.lineTo(neuron_hid_siting[j].x - ((Math.abs(neuron_hid_siting[j].x - neuron_in_siting[i].x) * 40) / l), neuron_hid_siting[j].y - ((Math.abs(neuron_hid_siting[j].y - neuron_in_siting[i].y) * 40) / l));
                    ctx.moveTo(neuron_in_siting[i].x, neuron_in_siting[i].y); 
                    ctx.lineTo(neuron_hid_siting[j].x, neuron_hid_siting[j].y); 
                    ctx.stroke();
                }
            }
            for (let i = 0; i < neuron_hid_siting.length; i++) {
                for (let j = 0; j < neuron_out_siting.length; j++) {
                    // let l = Math.sqrt((neuron_out_siting[j].x - neuron_hid_siting[i].x)**2 + (neuron_out_siting[j].y - neuron_hid_siting[i].y)**2);
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    // ctx.moveTo(neuron_hid_siting[i].x + ((Math.abs(neuron_out_siting[j].x - neuron_hid_siting[i].x) * 40) / l), neuron_hid_siting[i].y + ((Math.abs(neuron_out_siting[j].y - neuron_hid_siting[i].y) * 40) / l));
                    // ctx.lineTo(neuron_out_siting[j].x - ((Math.abs(neuron_out_siting[j].x - neuron_hid_siting[i].x) * 40) / l), neuron_out_siting[j].y - ((Math.abs(neuron_out_siting[j].y - neuron_hid_siting[i].y) * 40) / l));
                    ctx.moveTo(neuron_hid_siting[i].x, neuron_hid_siting[i].y); 
                    ctx.lineTo(neuron_out_siting[j].x, neuron_out_siting[j].y); 
                    ctx.stroke();
                }
            }
            for (let i = 0; i < this.inputs; i++) {
                this.drawNeuron (ctx, neuron_in_siting[i].x, neuron_in_siting[i].y, input[i]);
            }
            for (let i = 0; i < this.hidden; i++) {
                this.drawNeuron (ctx, neuron_hid_siting[i].x, neuron_hid_siting[i].y, hidden[i]);
            }
            for (let i = 0; i < this.output; i++) {
                this.drawNeuron (ctx, neuron_out_siting[i].x, neuron_out_siting[i].y, output[i]);
            }
        }

        sigmoid (x) {
            return (1 / (1 + Math.exp(-x)));
        }

        sigmoid_derivative (x) {
            return (this.sigmoid(x) * (1 - this.sigmoid(x)));
        }

        result (input) {
            this.hidden_layer = [];
            for (let i = 0; i < this.hidden; i++) {
                let sum = 0;
                for (let j = 0; j < this.inputs; j++) {
                    sum += input[j] * this.weigthIH[j][i];
                }
                sum += this.biasH[i];
                this.hidden_layer[i] = this.sigmoid(sum);
            }

            this.output_layer = [];
            for (let i = 0; i < this.output; i++) {
                let sum = 0;
                for (let j = 0; j < this.hidden; j++) {
                    sum += this.hidden_layer[j] * this.weigthHO[j][i];
                }
                sum += this.biasO[i];
                this.output_layer[i] = this.sigmoid(sum);
            }
            return this.output_layer;
        }

        train (input, output) {

            // прямое прохождение

            this.hidden_layer = [];
            this.hidden_derivative = [];
            for (let i = 0; i < this.hidden; i++) {
                let sum = 0;
                for (let j = 0; j < this.inputs; j++) {
                    sum += input[j] * this.weigthIH[j][i];
                }
                sum += this.biasH[i];
                this.hidden_layer[i] = this.sigmoid(sum);
                this.hidden_derivative[i] = this.sigmoid_derivative(sum);
            }

            this.output_layer = [];
            this.output_derivative = [];
            for (let i = 0; i < this.output; i++) {
                let sum = 0;
                for (let j = 0; j < this.hidden; j++) {
                    sum += this.hidden_layer[j] * this.weigthHO[j][i];
                }
                sum += this.biasO[i];
                this.output_layer[i] = this.sigmoid(sum);
                this.output_derivative[i] = this.sigmoid_derivative(sum);
            }

            // обратное прохождение

            this.error = [];
            for (let i = 0; i < this.output; i++) {
                this.error.push(output[i] - this.output_layer[i]);
                display_error.value = Math.abs(this.error);
            }

            // подсчёт градиентов

            let grad_output = [];
            for (let i = 0; i < this.output; i++) {
                grad_output.push(this.error[i] * this.output_derivative[i]);
                for (let j = 0; j < this.hidden; j++) {
                    this.weigthHO[j][i] += this.learningRate * grad_output[i] * this.hidden_layer[j];
                    this.biasO[i] += this.learningRate * grad_output[i];
                }
            }
            let grad_hidden = [];
            for (let i = 0; i < this.output; i++) {
                for (let j = 0; j < this.hidden; j++) {
                    grad_hidden.push(grad_output[i] * this.hidden_derivative[j] * this.weigthHO[j][i]);
                    for (let k = 0; k < this.inputs; k++) {
                        this.weigthIH[k][j] += this.learningRate * grad_hidden[j] * input[k];   
                        this.biasH[i] += this.learningRate * grad_hidden[i];
                    }
                }
            }

            return this.output_layer;
        }
    }

    let network = new NeuralNetwork (2, 3, 1);

    network.build();
    let mas = [0, 0, 0];
    network.drawLines(mas, mas, mas);

    function adjustColor(hex, amount) {
        let color = parseInt(hex.startsWith("#") ? hex.slice(1) : hex, 16);
        let r = Math.min(255, Math.max(0, (color >> 16) + amount));
        let g = Math.min(255, Math.max(0, ((color & 0x00FF00) >> 8) + amount));
        let b = Math.min(255, Math.max(0, (color & 0x0000FF) + amount));
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    button_learn.onclick = () => {
        network.train(training_data[1].inputs, training_data[1].targets);
        requestAnimationFrame(function learn () {
            for (let j = 0; j < training_data.length; j++) {
                let data = training_data[j];
                network.learningRate = display_rate.value;
                network.train(data.inputs, data.targets);
                display_input1.value = data.inputs[0];
                display_input2.value = data.inputs[1];
                display_hidden1.value = network.hidden_layer[0];
                display_hidden2.value = network.hidden_layer[1];
                display_hidden3.value = network.hidden_layer[2];
                display_output.value = network.output_layer[0];
                weigth11.value = network.weigthIH[0][0];
                weigth12.value = network.weigthIH[0][1];
                weigth13.value = network.weigthIH[0][2];
                weigth21.value = network.weigthIH[1][0];
                weigth22.value = network.weigthIH[1][1];
                weigth23.value = network.weigthIH[1][2];
                weigthH1O.value = network.weigthHO[0][0];
                weigthH2O.value = network.weigthHO[1][0];
                weigthH3O.value = network.weigthHO[2][0];
                network.drawLines(data.inputs, network.hidden_layer, network.output_layer);
            }
            if (Math.abs(network.error) > 0.01) {
                requestAnimationFrame(learn);
            }
            else {
                cancelAnimationFrame(learn);
            }
        })
        // while (Math.abs(network.error) > 0.0099) {
        //     for (let j = 0; j < training_data.length; j++) {
        //         let data = training_data[j];
        //         network.train(data.inputs, data.targets);
        //         // console.log(network.train(data.inputs, data.targets));
        //     }
        // }
    }

    button_result.onclick = () => {
        let input = [];
        input.push(display_data1.value);
        input.push(display_data2.value);
        display_result.value = network.result(input);
        display_input1.value = display_data1.value;
        display_input2.value = display_data2.value;
        display_hidden1.value = network.hidden_layer[0];
        display_hidden2.value = network.hidden_layer[1];
        display_hidden3.value = network.hidden_layer[2];
        display_output.value = network.result(input);
        weigth11.value = network.weigthIH[0][0];
        weigth12.value = network.weigthIH[0][1];
        weigth13.value = network.weigthIH[0][2];
        weigth21.value = network.weigthIH[1][0];
        weigth22.value = network.weigthIH[1][1];
        weigth23.value = network.weigthIH[1][2];
        weigthH1O.value = network.weigthHO[0][0];
        weigthH2O.value = network.weigthHO[1][0];
        weigthH3O.value = network.weigthHO[2][0];
        network.drawLines(input, network.hidden_layer, network.output_layer);
    }
}