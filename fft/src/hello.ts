import * as math from 'mathjs';
import * as _ from 'lodash';

function fft(signals: number[], start: number, size: number, s: number = 1): math.Complex[] {
  if (size === 1) {
    return [math.complex(signals[start], 0)];
  } else {
    const even = fft(signals, start, size/2, 2*s);
    const odd = fft(signals, start+s, size/2, 2*s);
    // combine DFTs of two halves into full DFT:
    const output = Array(size).fill(math.complex(0, 0));
    for (let k = 0; k < size/2; ++k) {
      const even_k = even[k];
      const odd_k = odd[k];
      const twiddle: math.Complex = math.exp( math.complex(0, -2 * math.pi * k / size));
      console.log(-2 * math.pi * k / size);
      output[k] = math.add(even_k, math.multiply(twiddle, odd_k));
      output[(k + size/2)] = math.subtract(even_k, math.multiply(twiddle, odd_k));
    }
    console.log(_.map(output, (c: math.Complex) => c.toPolar()  ));
    return output;
  }
}

function signal(t: number): number {
  const frequencies = [ 0, 1, 2, 3];
  const amplitudes = [0, 11, -1, 2];
  let sum = 0;
  _.forEach(frequencies, (frequency: number, i: number) => {
    sum += amplitudes[i] * math.cos(2 * math.pi * frequency * t)
  });
  return sum;
}

const times = [0, .25, .5, .75];
console.log(_.map(times, signal));
fft([4.2, 0, -1.4, -2.8], 0, 4);
