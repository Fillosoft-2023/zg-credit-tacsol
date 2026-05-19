const api_key = "ef7eb42d186239ac3a50602e0a9f9f38"

const b_codes = localStorage.getItem('branch_code');
const em_code = Number(localStorage.getItem('em_code'));
// const Api = "https://tacsol.in/sg_test/api.php?b_code="+b_codes+"&e_code="+em_code+"&api="+api_key+"&q="
// const Api = "https://democracylive24x7.com/shree_ganesh_main/api.php?b_code="+b_codes+"&e_code="+em_code+"&api="+api_key+"&q="
const Api = "https://tacsol.zgcredit.in/api/api.php?b_code=" + b_codes + "&e_code=" + em_code + "&api=" + api_key + "&q="


export default Api