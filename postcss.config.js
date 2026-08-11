const prefix = '.apgs-app';

export default {
  plugins: [
    {
      postcssPlugin: 'apgs-widget-scope',
      Rule(rule) {
        if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
        rule.selectors = rule.selectors.map((selector) => {
          const value = selector.trim();
          if (value === ':root') return prefix;
          if (value === 'body.is-modal-open') return value;
          if (value.startsWith(prefix)) return value;
          return `${prefix} ${value}`;
        });
      },
    },
  ],
};