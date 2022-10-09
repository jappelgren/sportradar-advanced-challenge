export class Utils {
    static preparedStatementGenerator<T>(argArr: T[]): string {
        let preparedOffset = 1;
        const preparedStatements = argArr
            .map((arg) => {
                let preparedString = `(`;
                const preparedArr = [];
                for (const _key in arg) {
                    preparedArr.push(`$${preparedOffset}`);
                    preparedOffset++;
                }
                preparedString = preparedString.concat(`${preparedArr.join(',')})`);
                return preparedString;
            })
            .join(',');
        return preparedStatements;
    }

    static nowInUtc() {
        const today = new Date();
        const nowUtc = Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate(),
            today.getUTCHours(),
            today.getUTCMinutes(),
            today.getUTCSeconds()
        );
        return nowUtc;
    }
}