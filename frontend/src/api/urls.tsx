export default function to_url_params(object: { [x: string]: any; size?: string | never[]; gender?: string | never[]; status?: string; shelter?: string | never[]; }) {
    var result = [];
    for (const key in object) {
        if (Array.isArray(object[key])) {
            for (const value of object[key]) {
                result.push(`${key}[]=${value.toString().toLowerCase()}`);
            }
        }
        else {
            let value = object[key];
            result.push(`${key}=${value.toString().toLowerCase()}`);
        }
    }
    return result.join('&');
}