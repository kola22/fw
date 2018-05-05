export enum DropDownState {
    Open,
    Collapsed
}

export enum DisplayState {
    Hide,
    Shown
}

export enum WorkFlowType {
    StandAlone,
    XeroBill,
    XeroPO,
    QuickBooksPO
}

export enum Confirm {
    Yes,
    No
}

export enum CloseState {
    NoChanges,
    DiscardChanges,
    ContinueEditing
}

export enum XeroSyncItem {
    Accounts,
    Contacts,
    Currencies,
    Items,
    Organization,
    Taxes,
    Themes,
    TrackingCategories
}

export enum CheckBoxState {
    Checked,
    Unchecked
}

export enum EnabledState {
    Enabled,
    Disabled
}

export enum CollapsedState {
    Expand,
    Collapsed
}

export enum Validation {
    Valid,
    NotValid,
    Any
}

export enum AddAction {
    ByEnter,
    ByButton
}



export enum ConditionsType {
    Any,
    Matches,
    DoesNotMatches,
    OverOrEqualTo,
    Under,
    Within,
    AnyAsSupplier
}

export enum XeroLoginMethod {
    WithFrom,
    WithoutForm
}

export enum ValueState {
    Set,
    NotSet
}

export enum CellViewState {
    Preview,
    Input
}

export enum SyncType {
    Xero,
    QB
}