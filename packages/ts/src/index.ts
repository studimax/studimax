export type Options = {
  transform: (data: {value: unknown; key: string}) => unknown;
  placeholder?: string;
};

/**
 * Template strings are a way to from a string from multiple values.
 * @param template The template string.
 * @param data The data to use in the template.
 * @param options The options to use when transforming the data.
 * @returns The transformed template string.
 * @author Maxime Scharwath
 */
export default function ts(
  template: string,
  data: unknown[] | Record<string, unknown>,
  options: Partial<Options> = {}
) {
  const opts: Options = {
    transform: ({value}) => value,
    ...options,
  };
  const braceRegex = /{(\d+|[a-z$_][\w\-$]*?(?:\.[\w\-$]*?)*?)}/gi;
  return template.replace(braceRegex, (placeholder: string, key: string) => {
    let value: unknown[] | Record<string, unknown> | undefined = data;
    for (const property of key.split('.')) {
      value = value ? value[property as never] : undefined;
    }
    const transformedValue = opts.transform({value, key});
    return transformedValue === undefined ? opts.placeholder ?? placeholder : String(transformedValue);
  });
}
