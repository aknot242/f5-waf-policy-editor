import { BaseVisitor } from "../interface/base.visitor";
import { FieldResolverVisitor } from "../interface/field-resolver.visitor";
import { GridFieldValueFactory } from "../base/grid-field-value.factory";
import { PolicyEditorDispatch } from "../../policy-editor.types";
import { CSRFURL } from "../../../../model/policy-schema/policy.definitions";
import { GridFieldValue } from "../../../../component/policy-editor/controls/grid-field-value.type";
import { policyEditorJsonVisit } from "../../policy-editor.actions";
import { get as _get, unset as _unset } from "lodash";
import { CsrfUrlsFieldFactory } from "./csrf-urls-field.factory";

export class CsrfUrlsFieldResolver
  extends BaseVisitor
  implements FieldResolverVisitor
{
  private visitorControlFactory: GridFieldValueFactory<CSRFURL>;

  constructor(
    public rowIndex: number,
    protected dispatch: PolicyEditorDispatch,
    protected json: any
  ) {
    super(dispatch, json);

    this.visitorControlFactory = new GridFieldValueFactory<CSRFURL>(
      rowIndex,
      dispatch,
      json,
      this.basePath
    );
  }

  key(): string {
    return `${this.json.url}::${this.json.method}`;
  }

  get hasAdvancedRows(): boolean {
    return false;
  }

  get basePath(): string {
    return "csrf-urls";
  }

  getAdvancedRows(): GridFieldValue[] {
    return [];
  }

  remove(): void {
    this.dispatch(
      policyEditorJsonVisit((currentJson) => {
        _get(currentJson, `policy.${this.basePath}`).splice(this.rowIndex, 1);
        if (_get(currentJson, `policy.${this.basePath}`).length === 0) {
          _unset(currentJson, `policy.${this.basePath}`);
        }
      })
    );
  }

  getBasicRows(): GridFieldValue[] {
    const fieldFactory = new CsrfUrlsFieldFactory(this.dispatch, this.json);

    return [
      this.visitorControlFactory.createDropListFieldControl(
        "Enforcement Action",
        "enforcementAction",
        fieldFactory,
        ["none", "verify-origin"]
      ),
      this.visitorControlFactory.createDropListFieldControl(
        "Method",
        "method",
        fieldFactory,
        ["GET", "POST", "any"]
      ),
      this.visitorControlFactory.createTextEditControl(
        "Url",
        "url",
        fieldFactory
      ),
    ];
  }
}
