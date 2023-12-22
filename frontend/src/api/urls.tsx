export default function to_url_params(object: any, lowercase: boolean) {
    var result = [];
    for (const key in object) {
        if (Array.isArray(object[key])) {
            for (const value of object[key]) {
                const val = lowercase ? value.toString().toLowerCase() : value.toString();
                result.push(`${key}[]=${val}`);
            }
        }
        else {
            let value = object[key];
            const val = lowercase ? value.toString().toLowerCase() : value.toString();
            result.push(`${key}=${val}`);
        }
    }
    return result.join('&');
}