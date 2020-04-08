//mapping functionallity for mapping the values between screen pixel and 
function map(input, input_start, input_end, output_start, output_end) {
  let ratio = (output_end - output_start) / (input_end - input_start);
  return ratio * (input - input_start) + output_start;
}

