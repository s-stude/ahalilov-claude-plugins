# My Claude Code Plugins

A collection of custom plugins for Claude Code.

## Plugins

- [Code Simplifier](marketplace/plugins/code-simplifier/README.md) - Autonomously simplifies and refines code for clarity, consistency, and maintainability while preserving all functionality. Focuses on recently modified code and applies project-specific best practices.

## Installation

### Add the marketplace

Using bash:

```bash
claude plugin marketplace add https://github.com/s-stude/ahalilov-claude-plugins.git
```

Or using a local path:

```bash
claude plugin marketplace add ./ahalilov-claude-plugins/marketplace
```

Inside Claude Code:

```
/plugin marketplace add https://github.com/s-stude/ahalilov-claude-plugins.git
```

### Install plugins

Once the marketplace is added, install individual plugins:

```bash
claude plugin install code-simplifier@ahalilov-plugins
```

Or inside Claude Code:

```
/plugin install code-simplifier@ahalilov-plugins
```


