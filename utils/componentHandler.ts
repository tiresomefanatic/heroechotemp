// utils/componentHandler.ts

// Define the structure for component configurations
interface ComponentConfig {
  name: string; // Component name (e.g., 'color-wheel')
  tag: string; // HTML tag to use in editor
  attributes: string[]; // List of allowed attributes
}

// Register available components
export const registeredComponents: ComponentConfig[] = [
  {
    name: "color-wheel",
    tag: "div",
    attributes: ["sportColor", "cruiserColor", "urbanColor", "offroadColor"],
  },
  // Add more components here as needed
  {
    name: "hero-banner",
    tag: "div",
    attributes: ["title", "subtitle", "backgroundImage", "alignment"],
  },
  {
    name: "feature-grid",
    tag: "div",
    attributes: ["columns", "gap", "items"],
  },
];

// Convert Tiptap HTML to Nuxt Content markdown format
export const convertToNuxtFormat = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;

  // Process each registered component
  registeredComponents.forEach((component) => {
    const elements = div.querySelectorAll(
      `${component.tag}[data-type="${component.name}"]`
    );

    elements.forEach((element) => {
      // Collect all valid attributes
      const attrs = component.attributes
        .map((attr) => {
          const value = element.getAttribute(attr);
          return value ? `${attr}="${value}"` : null;
        })
        .filter(Boolean)
        .join(" ");

      // Create Nuxt Content component syntax
      const nuxtComponent = `::${component.name}{${attrs}}\n::`;

      // Replace the HTML component with markdown syntax
      const placeholder = document.createElement("div");
      placeholder.innerHTML = nuxtComponent;
      element.replaceWith(placeholder);
    });
  });

  return div.innerHTML;
};

// Convert Nuxt Content markdown to Tiptap HTML format
export const convertToTiptapFormat = (markdown: string): string => {
  let result = markdown;

  registeredComponents.forEach((component) => {
    // Match Nuxt Content component syntax for this component
    const regex = new RegExp(`::${component.name}{([^}]+)}\\n::`, "g");

    result = result.replace(regex, (_, attrs) => {
      // Parse attributes
      const parsedAttrs = attrs.split(" ").reduce((acc, attr) => {
        const [key, value] = attr.split("=");
        if (key && value) {
          acc[key] = value.replace(/"/g, "");
        }
        return acc;
      }, {});

      // Create Tiptap HTML
      const attrString = Object.entries(parsedAttrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");

      return `<${component.tag} data-type="${component.name}" ${attrString}></${component.tag}>`;
    });
  });

  return result;
};

// Generate Tiptap extension configuration for a component
export const generateExtensionConfig = (component: ComponentConfig) => {
  const attributes = component.attributes.reduce((acc, attr) => {
    acc[attr] = {
      default: null,
      parseHTML: (element) => element.getAttribute(attr),
      renderHTML: (attributes) => {
        if (!attributes[attr]) return {};
        return { [attr]: attributes[attr] };
      },
    };
    return acc;
  }, {});

  return {
    name: component.name,
    group: "block",
    atom: true,
    addAttributes: () => attributes,
    parseHTML: () => [
      {
        tag: `${component.tag}[data-type="${component.name}"]`,
      },
      {
        tag: component.name,
      },
    ],
    renderHTML: ({ HTMLAttributes }) => {
      const attrs = {
        "data-type": component.name,
        ...HTMLAttributes,
      };
      return [component.tag, attrs];
    },
  };
};

// Helper function to register a new component
export const registerComponent = (config: ComponentConfig) => {
  registeredComponents.push(config);
};
