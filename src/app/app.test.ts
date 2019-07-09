import { MyApp } from "./app";

describe("Your App", () => {

    let app: MyApp;

    beforeEach(() => {
        app = new MyApp("Hello Jest");
    });

    it("has a message", () => {
        expect(app.message).toBe("Hello Jest");
    });
});