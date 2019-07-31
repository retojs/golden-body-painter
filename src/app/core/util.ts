export function logJson(...messages){
    console.log(...messages.map(msg =>
        typeof msg === 'object'
            ? JSON.stringify(msg, null, 2)
            : msg
    ));
}