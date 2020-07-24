import { post, getModelForClass, modelOptions, prop, DocumentType } from "@typegoose/typegoose"
import { errorHandlerGenerator, schemaOptionsGenerator } from '../../libs/typegoose'

@modelOptions(schemaOptionsGenerator(`api_errors`))
@post(`save`, errorHandlerGenerator)
export class ApiError {
  @prop()
  public headers?: object

  @prop({ required: true })
  public error: string

  @prop()
  public http?: any

  @prop()
  public ws?: any

  @prop()
  public userAgent?: any

  @prop()
  public remoteIP?: string

  @prop()
  public sessionToken?: string

  static get model() {
    return getModelForClass(this)
  }

  public get model(): DocumentType<ApiError> {
    return new ApiError.model(this)
  }
}