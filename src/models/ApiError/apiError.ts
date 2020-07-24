import { post, getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
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
}

export const ApiErrorRepo = getModelForClass(ApiError)
