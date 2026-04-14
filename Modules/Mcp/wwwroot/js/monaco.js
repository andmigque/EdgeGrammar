// Monaco editor controller.
// Scans for [data-monaco]:not([data-monaco-initialized]) elements and mounts an editor on each.
// Guards with data-monaco-initialized so HtmX body swaps don't double-mount existing editors.
//
// Required in head before this script:
//   <script src="https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js"></script>

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' } });
function mountMonacoEditors() {
    document.querySelectorAll('[data-monaco]:not([data-monaco-initialized])').forEach(el => {
        el.setAttribute('data-monaco-initialized', 'true');

        const language    = el.dataset.language;
        const srcCodePath = el.dataset.srcCodePath;

        require(['vs/editor/editor.main'], function() {
            fetch(srcCodePath)
                .then(r => r.text())
                .then(code => {
                    monaco.editor.create(el, {
                        value:           code,
                        language:        language,
                        theme:           'vs-dark',
                        readOnly:        false,
                        automaticLayout: true,
                        dragAndDrop: true,
                         dropIntoEditor: {
                            enabled: true,
                            showDropSelector: 'afterDrop'
                        }
                    });
                });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => { mountMonacoEditors(); });
document.body.addEventListener('htmx:afterSettle', () => { mountMonacoEditors(); });
document.body.addEventListener('monaco-render', () => { mountMonacoEditors(); });

/**
 * All available editor config properties
 * 
 * interface IStandaloneEditorConstructionOptions {
    acceptSuggestionOnCommitCharacter?: boolean;
    acceptSuggestionOnEnter?: "off" | "on" | "smart";
    accessibilityHelpUrl?: string;
    accessibilityPageSize?: number;
    accessibilitySupport?: "off" | "on" | "auto";
    allowOverflow?: boolean;
    allowVariableFonts?: boolean;
    allowVariableFontsInAccessibilityMode?: boolean;
    allowVariableLineHeights?: boolean;
    ariaContainerElement?: HTMLElement;
    ariaLabel?: string;
    ariaRequired?: boolean;
    autoClosingBrackets?: EditorAutoClosingStrategy;
    autoClosingComments?: EditorAutoClosingStrategy;
    autoClosingDelete?: EditorAutoClosingEditStrategy;
    autoClosingOvertype?: EditorAutoClosingEditStrategy;
    autoClosingQuotes?: EditorAutoClosingStrategy;
    autoDetectHighContrast?: boolean;
    autoIndent?: "none" | "advanced" | "full" | "brackets" | "keep";
    autoIndentOnPaste?: boolean;
    autoIndentOnPasteWithinString?: boolean;
    autoSurround?: EditorAutoSurroundStrategy;
    automaticLayout?: boolean;
    bracketPairColorization?: IBracketPairColorizationOptions;
    codeActionsOnSaveTimeout?: number;
    codeLens?: boolean;
    codeLensFontFamily?: string;
    codeLensFontSize?: number;
    colorDecorators?: boolean;
    colorDecoratorsActivatedOn?: "clickAndHover" | "click" | "hover";
    colorDecoratorsLimit?: number;
    columnSelection?: boolean;
    comments?: IEditorCommentsOptions;
    contextmenu?: boolean;
    copyWithSyntaxHighlighting?: boolean;
    cursorBlinking?: "blink" | "smooth" | "phase" | "expand" | "solid";
    cursorHeight?: number;
    cursorSmoothCaretAnimation?: "off" | "on" | "explicit";
    cursorStyle?: "line" | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin";
    cursorSurroundingLines?: number;
    cursorSurroundingLinesStyle?: "default" | "all";
    cursorWidth?: number;
    defaultColorDecorators?: "auto" | "always" | "never";
    definitionLinkOpensInPeek?: boolean;
    detectIndentation?: boolean;
    dimension?: IDimension;
    disableLayerHinting?: boolean;
    disableMonospaceOptimizations?: boolean;
    domReadOnly?: boolean;
    dragAndDrop?: boolean;
    dropIntoEditor?: IDropIntoEditorOptions;
    editContext?: boolean;
    emptySelectionClipboard?: boolean;
    experimentalGpuAcceleration?: "off" | "on";
    experimentalWhitespaceRendering?: "off" | "svg" | "font";
    extraEditorClassName?: string;
    fastScrollSensitivity?: number;
    find?: IEditorFindOptions;
    fixedOverflowWidgets?: boolean;
    folding?: boolean;
    foldingHighlight?: boolean;
    foldingImportsByDefault?: boolean;
    foldingMaximumRegions?: number;
    foldingStrategy?: "auto" | "indentation";
    fontFamily?: string;
    fontLigatures?: string | boolean;
    fontSize?: number;
    fontVariations?: string | boolean;
    fontWeight?: string;
    formatOnPaste?: boolean;
    formatOnType?: boolean;
    glyphMargin?: boolean;
    gotoLocation?: IGotoLocationOptions;
    guides?: IGuidesOptions;
    hideCursorInOverviewRuler?: boolean;
    hover?: IEditorHoverOptions;
    inDiffEditor?: boolean;
    inertialScroll?: boolean;
    inlayHints?: IEditorInlayHintsOptions;
    inlineCompletionsAccessibilityVerbose?: boolean;
    inlineSuggest?: IInlineSuggestOptions;
    insertSpaces?: boolean;
    language?: string;
    largeFileOptimizations?: boolean;
    letterSpacing?: number;
    lightbulb?: IEditorLightbulbOptions;
    lineDecorationsWidth?: string | number;
    lineHeight?: number;
    lineNumbers?: LineNumbersType;
    lineNumbersMinChars?: number;
    linkedEditing?: boolean;
    links?: boolean;
    matchBrackets?: "always" | "never" | "near";
    matchOnWordStartOnly?: boolean;
    maxTokenizationLineLength?: number;
    minimap?: IEditorMinimapOptions;
    model?: null | ITextModel;
    mouseMiddleClickAction?: MouseMiddleClickAction;
    mouseStyle?: "default" | "text" | "copy";
    mouseWheelScrollSensitivity?: number;
    mouseWheelZoom?: boolean;
    multiCursorLimit?: number;
    multiCursorMergeOverlapping?: boolean;
    multiCursorModifier?: "ctrlCmd" | "alt";
    multiCursorPaste?: "spread" | "full";
    occurrencesHighlight?: "off" | "singleFile" | "multiFile";
    occurrencesHighlightDelay?: number;
    overflowWidgetsDomNode?: HTMLElement;
    overtypeCursorStyle?: "line" | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin";
    overtypeOnPaste?: boolean;
    overviewRulerBorder?: boolean;
    overviewRulerLanes?: number;
    padding?: IEditorPaddingOptions;
    parameterHints?: IEditorParameterHintOptions;
    pasteAs?: IPasteAsOptions;
    peekWidgetDefaultFocus?: "tree" | "editor";
    placeholder?: string;
    quickSuggestions?: boolean | IQuickSuggestionsOptions;
    quickSuggestionsDelay?: number;
    readOnly?: boolean;
    readOnlyMessage?: IMarkdownString;
    renameOnType?: boolean;
    renderControlCharacters?: boolean;
    renderFinalNewline?: "off" | "on" | "dimmed";
    renderLineHighlight?: "all" | "line" | "none" | "gutter";
    renderLineHighlightOnlyWhenFocus?: boolean;
    renderRichScreenReaderContent?: boolean;
    renderValidationDecorations?: "off" | "on" | "editable";
    renderWhitespace?: "all" | "none" | "boundary" | "selection" | "trailing";
    revealHorizontalRightPadding?: number;
    roundedSelection?: boolean;
    rulers?: (number | IRulerOption)[];
    screenReaderAnnounceInlineSuggestion?: boolean;
    scrollBeyondLastColumn?: number;
    scrollBeyondLastLine?: boolean;
    scrollOnMiddleClick?: boolean;
    scrollPredominantAxis?: boolean;
    scrollbar?: IEditorScrollbarOptions;
    selectOnLineNumbers?: boolean;
    selectionClipboard?: boolean;
    selectionHighlight?: boolean;
    selectionHighlightMaxLength?: number;
    selectionHighlightMultiline?: boolean;
    semanticHighlighting.enabled?: boolean | "configuredByTheme";
    showDeprecated?: boolean;
    showFoldingControls?: "always" | "never" | "mouseover";
    showUnused?: boolean;
    smartSelect?: ISmartSelectOptions;
    smoothScrolling?: boolean;
    snippetSuggestions?: "none" | "top" | "bottom" | "inline";
    stablePeek?: boolean;
    stickyScroll?: IEditorStickyScrollOptions;
    stickyTabStops?: boolean;
    stopRenderingLineAfter?: number;
    suggest?: ISuggestOptions;
    suggestFontSize?: number;
    suggestLineHeight?: number;
    suggestOnTriggerCharacters?: boolean;
    suggestSelection?: "first" | "recentlyUsed" | "recentlyUsedByPrefix";
    tabCompletion?: "off" | "on" | "onlySnippets";
    tabFocusMode?: boolean;
    tabIndex?: number;
    tabSize?: number;
    theme?: string;
    trimAutoWhitespace?: boolean;
    trimWhitespaceOnDelete?: boolean;
    unfoldOnClickAfterEndOfLine?: boolean;
    unicodeHighlight?: IUnicodeHighlightOptions;
    unusualLineTerminators?: "off" | "auto" | "prompt";
    useShadowDOM?: boolean;
    useTabStops?: boolean;
    value?: string;
    wordBasedSuggestions?: "off" | "currentDocument" | "matchingDocuments" | "allDocuments";
    wordBasedSuggestionsOnlySameLanguage?: boolean;
    wordBreak?: "normal" | "keepAll";
    wordSegmenterLocales?: string | string[];
    wordSeparators?: string;
    wordWrap?: "off" | "on" | "wordWrapColumn" | "bounded";
    wordWrapBreakAfterCharacters?: string;
    wordWrapBreakBeforeCharacters?: string;
    wordWrapColumn?: number;
    wordWrapOverride1?: "off" | "on" | "inherit";
    wordWrapOverride2?: "off" | "on" | "inherit";
    wrapOnEscapedLineFeeds?: boolean;
    wrappingIndent?: "none" | "same" | "indent" | "deepIndent";
    wrappingStrategy?: "simple" | "advanced";
 */
