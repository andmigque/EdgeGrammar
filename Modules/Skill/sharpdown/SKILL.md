---
name: sharpdown
description: "SharpDown is the C# documentation standard that replaces standard C# XML style comments. Use it when writing any .cs doc or when writing MCP tool Descriptions."
---

# SharpDown

> SharpDown is the C# documentation standard that replaces standard C# XML style comments. It uses standard markdown syntax in `.cs` files commented by triple slash `///`.

---

## 1. Style

### 1.1 Type

> You may have both, either, or an (unordered, ordered) list pair. Everything is mandatory. Ensure new lines for readability.

##### 1.1.1 The type header is h1.
> ##### 1.1.2 New line `///`
##### 1.1.3 Block quote description — e.g. `SxNodeBase` is a Builder base class.
> ##### 1.1.4 New line `///`
##### 1.1.5 The bulleted list denotes usage notes that do not need a particular order.
> ##### 1.1.6 New line `///`
##### 1.1.7 The numbered list means the build _must_ be called in that order.
##### 1.1.8 One signifies the method should only be called once.
> ##### 1.1.9 New line `///`

#### 1.1.10 Example

```csharp
/// # SxNodeBase
///
/// > The SharpeX node base. Every `SxN*` node inherits from this class.
///
/// - `this` class exposes the [Builder](https://refactoring.guru/design-patterns/builder) pattern.
/// - `this` class seals itself after `Build()` — no method may be called twice.
/// - `this` class intends to be _**expressed**_ via the following chain:
///
/// 1. **Init**: One
/// 2. **CssClass**: One
/// 3. **Build**
///
```

---

### 1.2 Methods

> Each public method gets its own block. Repeat the pattern for every method in the type.

##### 1.2.1 The methods section begins with `## Methods` as h2.
> ##### 1.2.2 New line `///`
##### 1.2.3 Method name is h3.
> ##### 1.2.4 New line `///`
##### 1.2.5 Block quote description of what the method does.
> ##### 1.2.6 New line `///`
##### 1.2.7 Fenced `csharp` block containing the method signature only — no body.
> ##### 1.2.8 New line `///`
##### 1.2.9 Bulleted Parameters, Returns, and Exceptions. Omit any section with no content.

#### 1.2.10 Begin

```csharp
/// ## Methods
///
```

#### 1.2.11 Example

```csharp
/// ### Init
///
/// > Initializes the element with a DOM node.
///
/// ```csharp
/// public T Init(string domNode, string id);
/// ```
///
/// - **Parameters**
///   - `string` **domNode** - The HTML element type to create (e.g. `"div"`, `"a"`, `"button"`).
///   - `string` **id** - The `id` attribute to assign to the element.
/// - **Returns**
///   - `T` - The current instance for method chaining.
///
```

---

### 1.3 Imports, Namespace, Definition

> This information is last based on importance.

##### 1.3.1 Imports section is h2.
> ##### 1.3.2 New line `///`
##### 1.3.3 Fenced `csharp` block containing the `using` statements.
> ##### 1.3.4 New line `///`
##### 1.3.5 Namespace section is h2.
> ##### 1.3.6 New line `///`
##### 1.3.7 Fenced `csharp` block containing the namespace declaration.
> ##### 1.3.8 New line `///`
##### 1.3.9 Definition section is h2.
> ##### 1.3.10 New line `///`
##### 1.3.11 Fenced `csharp` block containing the full type definition signature.

#### 1.3.12 Example

```csharp
/// ## Imports
///
/// ```csharp
/// using AngleSharp.Dom;
/// ```
///
/// ## Namespace
///
/// ```csharp
/// Sx.Node
/// ```
///
/// ## Definition
///
/// ```csharp
/// public class SxNodeBase : ISxNodeSmall<SxNodeBase>
/// ```
```

---

## 3. MCP Description

> MCP `[Description]` attributes follow SharpDown structure, adapted for the tool boundary.

#### 3.1 Example

#### 3.1.1 The tool name is h3.
> ##### 1.3.8 New line `///`
##### 3.1.3 Block quote description of what the tool does.
> ##### 1.3.8 New line `///`
##### 3.1.5 Bulleted Parameters — one sub-bullet per parameter with backtick type, bold name, and description.
> ##### 1.3.8 New line `///`
##### 3.1.7 Bulleted Returns — backtick type and description.
> ##### 1.3.8 New line `///`
##### 3.1.9 Bulleted Throws — the constraint, then nested bullets listing every valid enum value.

#### 3.1.10 Example

```csharp
[Description("""
    ### get_memories

    > Gets the memories for an entity based on count.

    - **Parameters**
        - `string` **entity** - An `EntityEnum` string value.
        - `int` **count** - The number of records to return.
    - **Returns**
        - `json` - A serialized json memories array.
    - **Throws**
        - EntityEnum must Enum.TryParse into one of:
            - Architect
            - Gemini
            - Claude
            - Grok
            - GPT
            - Human
            - Self
            - System
            - Agent
            - Codex
            - Qwen
""")]
```