import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { Component, createRef } from "react";
import basket from "../../../assets/images/shopping-basket.png";
import plus from "../../../assets/images/userdash/plus.svg";
import hyperLink from "../../../assets/images/link.svg";
import undo from "../../../assets/images/rotate-ccw.svg";
import redo from "../../../assets/images/rotate-cw.svg";
import crossX from "../../../assets/images/x.svg";
import bold from "../../../assets/images/bold.svg";
import italic from "../../../assets/images/italic.svg";
import underline from "../../../assets/images/underline.svg";
import align_center from "../../../assets/images/align-center.svg";
import align_justify from "../../../assets/images/align-justify.svg";
import align_left from "../../../assets/images/align-left.svg";
import align_right from "../../../assets/images/align-right.svg";
import list from "../../../assets/images/list (1).svg";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import { Editor } from "react-draft-wysiwyg";
import { Editor } from "@tinymce/tinymce-react";
import uploadImg from "../../../assets/images/image.svg";

import {
  setKnowledgeCategory,
  setKnowledgeArticle,
  setKnowledgeArticleForm,
  setKnowledgeCategoryForm,
} from "../../../redux/actions/ReduxActionPage.jsx";
import { Accordion, Badge, FloatingLabel, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import { AlertContext } from "../../common/Alert";
import { withRouter } from "react-router-dom";
import htmlToDraft from "html-to-draftjs";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import {
  createAndUpdateCategory,
  getCategoryList,
  deleteAndEditCategory,
  createAndUpdateArticle,
  listArticle,
  fetchAndDeleteArticle,
  duplicateArticle,
} from "./server/knowledgebaseServer";
// import { uploadImageCallBack } from "../server/OfflineMessageServer";
import { uploadImageCallBack } from "../../agent/offline-messages/server/OfflineMessageServer";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export class KnowledgeBaseSettingComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);

    this.state = {
      categoryCreated: false,
      showListCategory: false,
      checkBoxEdit: false,
      messageText: "",
      formData: {
        slug: "",
        category_id: "",
        subtype: "",
        newtab: 0,
        tags: "",
        title: "",
        description: "",
        type: "create",
      },
      categoryForm: {
        type: "create",
        name: "",
      },
      categoryLoading: false,
      loading: false,
      categoryList: [],
      categoryModel: false,
      folderModel: false,
      articalShow: false,
    };
    this.editorRef = createRef();
    this.fetchCategoryList = this.fetchCategoryList.bind(this);
    this.createAndUpdateCategory = this.createAndUpdateCategory.bind(this);
  }

  componentDidMount() {
    let _this = this;

    if (_this.props.category.length === 0) {
      _this.fetchCategoryList();
    } else {
      let tempObj = { ..._this.props.articleForm };
      if (_this.props.categoryForm.id > 0) {
        tempObj["category_id"] = _this.props.categoryForm.id;
      } else {
        tempObj["category_id"] = _this.props.category[0].id;
      }
      this.props.setArticleForm(tempObj);
      _this.setState({
        categoryLoading: false,
      });
    }

    if (_this.props.match.params.id) {
      const params = "?type=edit&id=" + parseInt(_this.props.match.params.id);
      _this.context.showLoading();
      fetchAndDeleteArticle(
        params,
        (res) => {
          _this.context.showLoading(false);
          const articleForm = res;
          articleForm.tags = res.tags.split(",");
          console.log("articleForm", articleForm.newtab);

          // const contentBlock = htmlToDraft(res.description);
          // let messageText = "";
          // if (contentBlock) {
          //   const contentState = ContentState.createFromBlockArray(
          //     contentBlock.contentBlocks
          //   );
          //   const editorState = EditorState.createWithContent(contentState);
          //   messageText = editorState;
          // }
          articleForm.type = "update";
          articleForm.description = res.description;
          articleForm.messageText = "";
          articleForm.showButton = true;
          this.props.setArticleForm(articleForm);
        },
        (err) => {}
      );
    } else {
      this.props.setArticleForm({
        messageText: "",
        slug: "",
        subtype: "",
        newtab: 0,
        category_id: this.props.categoryForm.id,
        tags: "",
        title: "",
        description: "",
        type: "create",
      });
    }
  }

  fetchEditArticle = () => {
    const fetchArticle = htmlToDraft(this.props.html);
  };

  handleInputChange = (e) => {
    let tempObj = this.state.formData;
    tempObj[e.target.name] = e.target.value;
    this.setState({
      formData: tempObj,
    });
  };

  fetchCategoryList() {
    let _this = this;
    console.log(_this.props);
    getCategoryList(
      "",
      (res) => {
        console.log("categorylist", res);
        if (res.status === "True") {
          this.props.setCategory(res.categorylist);

          this.setState({
            categoryLoading: false,
          });
        } else {
          let tempObj = this.state.categoryLoading;
          tempObj["id"] = "";
          tempObj["name"] = "";
          this.setState({
            categoryLoading: false,
          });
        }
      },
      (err) => {
        this.setState({
          categoryLoading: false,
        });
      }
    );
  }

  createAndUpdateCategory() {
    this.context.showLoading(true);

    createAndUpdateCategory(
      this.props.categoryForm,
      (res) => {
        if (res.status === "True") {
          this.setState({
            categoryModel: false,
          });

          this.fetchCategoryList();
          this.context.showAlert({
            type: "success",
            message: res.message,
          });
        }
      },
      (err) => {
        this.context.showAlert({
          type: "success",
          message: err.message || "create category failed",
        });
      }
    );

    let tempObj = this.props.categoryForm;
    tempObj["name"] = "";
    this.setState({
      categoryForm: tempObj,
    });
  }

  handleCategoryModelClose = () => {
    this.setState({
      categoryModel: false,
    });
  };

  handleCategoryModelOpen = () => {
    let tempObj = { ...this.props.categoryForm };
    // tempObj["name"] = "";
    tempObj["type"] = "create";
    this.props.setCategoryForm(tempObj);
    this.setState({
      categoryModel: true,
    });
  };

  handleFolderModelOpen = () => {
    this.setState({
      folderModel: true,
    });
  };

  handleFolderModelClose = () => {
    this.setState({
      folderModel: false,
    });
  };

  uploadImageCallBackfn = (file, filetype) => {
    return uploadImageCallBack(file, filetype);
  };

  handleArticleForm = (e) => {
    const { name, value } = e.target;
    const tempObj = { ...this.props.articleForm };
    tempObj[name] = value;
    if ((name == "slug") && value.includes("https")) {
      tempObj["subtype"] = "slug";
    }
    tempObj.showButton = false;
    this.props.setArticleForm(tempObj);
  };

  handleChange = (event) => {
    const { name } = event.target;
    const tempObj = { ...this.props.articleForm };
    if (event.target.checked) {
      tempObj[name] = 1;
    } else {
      tempObj[name] = 0;
    }
    tempObj.showButton = false;
    this.props.setArticleForm(tempObj);
  };

  render() {
    let _this = this;
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const top100Films = [
      { title: "Excepte", year: 1994 },
      { title: "sint", year: 1994 },
      { title: "occaecat", year: 1994 },
      { title: "sint", year: 1994 },
      { title: "occaecat", year: 1994 },
    ];

    const data = [
      ["What is the Knowledge Base?", "10", "10", "English", "PUBLISHED"],
      ["Setting up your Knowledge Base", "10", "10", "Turkish", "DRAFT"],
      [
        "Creating a new Knowledge Base artic..",
        "36",
        "36",
        "English",
        "PUBLISHED",
      ],
      [
        "Customizing your Knowledge Base fo..",
        "10",
        "10",
        "English",
        "PUBLISHED",
      ],
    ];

    const options = {
      filterType: "dropdown",
      print: false,
      download: false,
      filter: false,
      viewColumns: false,
      search: false,
      pagination: false,
    };

    return (
      <div className="knowledge_section knowledge_base_section">
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <div className="knowledge_box">
              <div className="knowledge_header">Settings</div>

              <div className="setting-block">
                <Form>
                  <Form.Group
                    className="mb-3 slug-link-block"
                    controlId="formBasicSlug"
                  >
                    <Form.Label>Load from external URL</Form.Label>
                    <div className="hyper-link-block">
                      <img src={hyperLink} alt="" />
                      <Form.Control
                        type="text"
                        name="slug"
                        value={this.props.articleForm.slug}
                        onChange={_this.handleArticleForm}
                      />
                    </div>
                  </Form.Group>
                  <Form.Check
                    type="checkbox"
                    id="newtab"
                    label="New Tab"
                    name="newtab"
                    checked={this.props.articleForm.newtab ? 1 : 0}
                    onChange={_this.handleChange}
                  />

                  <Form.Group
                    className="mb-3 slug-link-block create-category-block"
                    controlId="formBasicSlug"
                  >
                    <div className="create-category">
                      <Form.Label>Category</Form.Label>
                      <span
                        className="create"
                        onClick={this.handleCategoryModelOpen}
                      >
                        <img src={plus} alt="" />
                        Create new category
                      </span>
                    </div>
                    <Form.Select
                      value={this.props.articleForm.category_id}
                      name="category_id"
                      onChange={_this.handleArticleForm}
                    >
                      <option value={0}>Select Category</option>
                      {this.props.category.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>

                  {/* <Form.Group
                    className="mb-3 slug-link-block create-category-block"
                    controlId="formBasicSlug"
                  >
                    <div className="create-category">
                      <Form.Label>Folder</Form.Label>
                      <span
                        className="create"
                        onClick={this.handleFolderModelOpen}
                      >
                        <img src={plus} alt="" />
                        Create new folder
                      </span>
                    </div>
                    <Form.Select>
                      <option>Select folder</option>
                    </Form.Select>
                  </Form.Group> */}

                  <Form.Group
                    className="mb-3 slug-link-block create-category-block tag-block"
                    controlId="formBasicSlug"
                  >
                    <Form.Label>Tags</Form.Label>
                    <Autocomplete
                      multiple
                      freeSolo={true}
                      name="tags"
                      value={
                        this.props.articleForm.tags
                          ? this.props.articleForm.tags
                          : []
                      }
                      onChange={(e, newValue) => {
                        const tempObj = { ...this.props.articleForm };
                        tempObj["tags"] = newValue;
                        tempObj.showButton = false;
                        this.props.setArticleForm(tempObj);
                      }}
                      id="checkboxes-tags-demo"
                      options={[]}
                      // disableCloseOnSelect
                      // getOptionLabel={(option) => {
                      //   return option;
                      // }}
                      //   renderOption={(props, option, { selected }) => {
                      //     return (
                      //     <li {...props}>
                      //       <Checkbox
                      //         icon={icon}
                      //         checkedIcon={checkedIcon}
                      //         // style={{ marginRight: 8 }}
                      //         checked={selected}
                      //       />
                      //       {option.title}
                      //     </li>
                      //   );
                      // }}
                      style={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          name="tags"
                          sx={{
                            "& legend": { display: "none" },
                            "& fieldset": { top: 0 },
                          }}
                          {...params}
                          InputLabelProps={{ shrink: false }}
                          label=""
                        />
                      )}
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Grid>
          <Grid item xs={8}>
            <div className="knowledge_box knowledge_box_setting">
              <div className="setting-editor-block">
                <Form.Group
                  className="input-field-block"
                  controlId="formBasicTitle"
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    name="title"
                    value={this.props.articleForm.title}
                    onChange={_this.handleArticleForm}
                    className=""
                  />
                </Form.Group>

                <div className="chat-msg-block">
                  <div className="offline_email_section">
                    <div className="email_top">
                      <div className="w-100">
                        <div className="reply_message">
                          <div className="msg_text"></div>
                          {/* <Editor
                            stripPastedStyles={true}
                            editorState={_this.props.articleForm.messageText}
                            onEditorStateChange={(value) => {
                              console.log(value);
                              let tempObj = { ..._this.props.articleForm };
                              tempObj["messageText"] = value;
                              this.props.setArticleForm(tempObj);
                            }}
                            toolbar={{
                              options: [
                                "history",
                                "inline",
                                "list",
                                "textAlign",
                                "emoji",
                                "image",
                                "colorPicker",
                                "blockType",
                                "fontSize",
                                "fontFamily",
                                "link",
                                "embedded",
                              ],
                              history: {
                                undo: {
                                  icon: undo,
                                  className: "demo-option-custom-undo",
                                },
                                redo: {
                                  icon: redo,
                                  className: "demo-option-custom-undo",
                                },
                              },
                              inline: {
                                options: [
                                  "bold",
                                  "italic",
                                  "underline",
                                  "monospace",
                                  "strikethrough",
                                  "superscript",
                                  "subscript",
                                ],
                                bold: {
                                  icon: bold,
                                  className: "demo-option-custom",
                                },
                                italic: {
                                  icon: italic,
                                  className: "demo-option-custom",
                                },
                                underline: {
                                  icon: underline,
                                  className: "demo-option-custom",
                                },
                                strikethrough: {
                                  icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==",
                                  className: undefined,
                                },
                                monospace: {
                                  icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=",
                                  className: undefined,
                                },
                                superscript: {
                                  icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcuMzA1IDEwLjE2NUwxMS44NjUgMTVIOS4wNTdsLTMuMTkyLTMuNTM2TDIuNzQ2IDE1SDBsNC41MjMtNC44MzVMLjIxOCA1LjYwM2gyLjc3TDUuOTg2IDguOTEgOS4wMSA1LjYwM2gyLjY0OWwtNC4zNTQgNC41NjJ6bTYuMjM0LTMuMjY5bDEuODc5LTEuMzA2Yy42NC0uNDE2IDEuMDYyLS44MDEgMS4yNjQtMS4xNTcuMjAxLS4zNTYuMzAyLS43MzguMzAyLTEuMTQ4IDAtLjY2OS0uMjM3LTEuMjEtLjcxLTEuNjItLjQ3NC0uNDExLTEuMDk3LS42MTctMS44NjgtLjYxNy0uNzQ0IDAtMS4zNC4yMDgtMS43ODUuNjI0LS40NDcuNDE2LS42NyAxLjA0My0uNjcgMS44ODFoMS40MzZjMC0uNS4wOTQtLjg0Ni4yODEtMS4wMzguMTg4LS4xOTEuNDQ1LS4yODcuNzcyLS4yODdzLjU4NS4wOTcuNzc3LjI5MmMuMTkuMTk1LjI4Ni40MzcuMjg2LjcyNiAwIC4yOS0uMDg5LjU1LS4yNjYuNzg1cy0uNjcuNjI4LTEuNDc5IDEuMTg0Yy0uNjkxLjQ3Ny0xLjYyNy45MjctMS45MDggMS4zNWwuMDE0IDEuNTY5SDE3VjYuODk2aC0zLjQ2MXoiLz48L3N2Zz4=",
                                  className: undefined,
                                },
                                subscript: {
                                  icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExLjg2NiAxMS42NDZIOS4wNkw1Ljg2NyA3Ljk0MmwtMy4xMjEgMy43MDRIMGw0LjUyNC01LjA2NEwuMjE4IDEuODA0aDIuNzdsMyAzLjQ2NCAzLjAyMy0zLjQ2NGgyLjY1TDcuMzA2IDYuNTgybDQuNTYgNS4wNjR6bTEuNzI1IDIuMDU4bDEuODI3LTEuMzY4Yy42NC0uNDM1IDEuMDYyLS44NCAxLjI2NC0xLjIxMi4yMDItLjM3Mi4zMDItLjc3My4zMDItMS4yMDIgMC0uNy0uMjM3LTEuMjY2LS43MS0xLjY5Ni0uNDc0LS40MzEtMS4wOTctLjY0Ni0xLjg2OS0uNjQ2LS43NDQgMC0xLjM0LjIxOC0xLjc4NS42NTMtLjQ0Ni40MzYtLjY3IDEuMDkyLS42NyAxLjk3aDEuNDM2YzAtLjUyNC4wOTQtLjg4Ni4yODEtMS4wODcuMTg4LS4yLjQ0NS0uMzAxLjc3Mi0uMzAxcy41ODYuMTAyLjc3Ny4zMDZjLjE5LjIwNC4yODYuNDU4LjI4Ni43NiAwIC4zMDMtLjA4OC41NzctLjI2Ni44MjItLjE3Ny4yNDUtLjY3LjY1OC0xLjQ3OCAxLjI0LS42OTIuNS0xLjYyOC45NzEtMS45MSAxLjQxM0wxMS44NjQgMTVIMTd2LTEuMjk2aC0zLjQxeiIvPjwvc3ZnPg==",
                                  className: undefined,
                                },
                              },
                              textAlign: {
                                options: ["left", "center", "right", "justify"],
                                left: {
                                  icon: align_left,
                                  className: "demo-option-custom",
                                },
                                center: {
                                  icon: align_center,
                                  className: "demo-option-custom",
                                },
                                right: {
                                  icon: align_right,
                                  className: "demo-option-custom",
                                },
                                justify: {
                                  icon: align_justify,
                                  className: "demo-option-custom",
                                },
                              },
                              list: {
                                options: ["ordered", "unordered"],
                                ordered: {
                                  icon: list,
                                  className: "demo-option-custom",
                                },
                                unordered: {
                                  icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS43MiAzLjQyN2MuOTUxIDAgMS43MjItLjc2OCAxLjcyMi0xLjcwOFMyLjY3LjAxIDEuNzIuMDFDLjc3LjAwOCAwIC43NzUgMCAxLjcxNWMwIC45NC43NzQgMS43MTEgMS43MiAxLjcxMXptMC0yLjYyNWMuNTEgMCAuOTIyLjQxMi45MjIuOTE0YS45Mi45MiAwIDAgMS0xLjg0MiAwIC45Mi45MiAwIDAgMSAuOTItLjkxNHpNMS43MiA4LjcwM2MuOTUxIDAgMS43MjItLjc2OCAxLjcyMi0xLjcwOFMyLjY3IDUuMjg3IDEuNzIgNS4yODdDLjc3IDUuMjg3IDAgNi4wNTIgMCA2Ljk5NXMuNzc0IDEuNzA4IDEuNzIgMS43MDh6bTAtMi42MjJjLjUxIDAgLjkyMi40MTIuOTIyLjkxNGEuOTIuOTIgMCAwIDEtMS44NDIgMGMwLS41MDUuNDE1LS45MTQuOTItLjkxNHpNMS43MiAxMy45ODJjLjk1MSAwIDEuNzIyLS43NjggMS43MjItMS43MDggMC0uOTQzLS43NzQtMS43MDgtMS43MjEtMS43MDgtLjk0NyAwLTEuNzIxLjc2OC0xLjcyMSAxLjcwOHMuNzc0IDEuNzA4IDEuNzIgMS43MDh6bTAtMi42MjVjLjUxIDAgLjkyMi40MTIuOTIyLjkxNGEuOTIuOTIgMCAxIDEtMS44NDIgMCAuOTIuOTIgMCAwIDEgLjkyLS45MTR6TTUuNzQ0IDIuMTE1aDkuODQ1YS40LjQgMCAwIDAgLjQwMS0uMzk5LjQuNCAwIDAgMC0uNDAxLS4zOTlINS43NDRhLjQuNCAwIDAgMC0uNDAyLjM5OS40LjQgMCAwIDAgLjQwMi4zOTl6TTUuNzQ0IDcuMzk0aDkuODQ1YS40LjQgMCAwIDAgLjQwMS0uMzk5LjQuNCAwIDAgMC0uNDAxLS4zOThINS43NDRhLjQuNCAwIDAgMC0uNDAyLjM5OC40LjQgMCAwIDAgLjQwMi4zOTl6TTUuNzQ0IDEyLjY3aDkuODQ1YS40LjQgMCAwIDAgLjQwMS0uMzk5LjQuNCAwIDAgMC0uNDAxLS4zOTlINS43NDRhLjQuNCAwIDAgMC0uNDAyLjQuNC40IDAgMCAwIC40MDIuMzk4eiIvPjwvZz48L3N2Zz4=",
                                  className: "demo-option-custom",
                                },
                              },
                              fontSize: {
                                options: [
                                  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48,
                                  60, 72, 96,
                                ],
                                className:
                                  "bg-transparent demo-option-custom text-dark",
                                component: undefined,
                                dropdownClassName: undefined,
                              },
                              fontFamily: {
                                options: [
                                  "Arial",
                                  "Georgia",
                                  "Impact",
                                  "Tahoma",
                                  "Times New Roman",
                                  "Verdana",
                                ],
                                className: "bg-transparent demo-option-custom",
                                component: undefined,
                                dropdownClassName: undefined,
                              },
                              image: {
                                icon: uploadImg,
                                className: undefined,
                                component: undefined,
                                popupClassName: undefined,
                                urlEnabled: true,
                                uploadEnabled: true,
                                alignmentEnabled: false,
                                uploadCallback: this.uploadImageCallBackfn,
                                previewImage: true,
                                inputAccept:
                                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                                alt: { present: false, mandatory: false },
                                defaultSize: {
                                  height: "100px",
                                  width: "100px",
                                },
                              },
                              colorPicker: {
                                icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTQuNDA2LjU4NWExLjk5OCAxLjk5OCAwIDAgMC0yLjgyNSAwbC0uNTQuNTRhLjc0MS43NDEgMCAxIDAtMS4wNDggMS4wNDhsLjE3NS4xNzUtNS44MjYgNS44MjUtMi4wMjIgMi4wMjNhLjkxLjkxIDAgMCAwLS4yNjYuNjAybC0uMDA1LjEwOHYuMDAybC0uMDgxIDEuODI5YS4zMDIuMzAyIDAgMCAwIC4zMDIuMzE2aC4wMTNsLjk3LS4wNDQuNTkyLS4wMjYuMjY4LS4wMTJjLjI5Ny0uMDEzLjU3OS0uMTM3Ljc5LS4zNDdsNy43Ny03Ljc3LjE0Ni4xNDRhLjc0Ljc0IDAgMCAwIDEuMDQ4IDBjLjI5LS4yOS4yOS0uNzU5IDAtMS4wNDhsLjU0LS41NGMuNzgtLjc4Ljc4LTIuMDQ0IDAtMi44MjV6TTguNzk1IDcuMzMzbC0yLjczLjUxNSA0LjQ1Mi00LjQ1MiAxLjEwOCAxLjEwNy0yLjgzIDIuODN6TTIuMDggMTMuNjczYy0xLjE0OCAwLTIuMDguMjk1LTIuMDguNjYgMCAuMzYzLjkzMi42NTggMi4wOC42NTggMS4xNSAwIDIuMDgtLjI5NCAyLjA4LS42NTkgMC0uMzY0LS45My0uNjU5LTIuMDgtLjY1OXoiLz48L2c+PC9zdmc+",
                                className: undefined,
                                component: undefined,
                                popupClassName: undefined,
                                colors: [
                                  "rgb(97,189,109)",
                                  "rgb(26,188,156)",
                                  "rgb(84,172,210)",
                                  "rgb(44,130,201)",
                                  "rgb(147,101,184)",
                                  "rgb(71,85,119)",
                                  "rgb(204,204,204)",
                                  "rgb(65,168,95)",
                                  "rgb(0,168,133)",
                                  "rgb(61,142,185)",
                                  "rgb(41,105,176)",
                                  "rgb(85,57,130)",
                                  "rgb(40,50,78)",
                                  "rgb(0,0,0)",
                                  "rgb(247,218,100)",
                                  "rgb(251,160,38)",
                                  "rgb(235,107,86)",
                                  "rgb(226,80,65)",
                                  "rgb(163,143,132)",
                                  "rgb(239,239,239)",
                                  "rgb(255,255,255)",
                                  "rgb(250,197,28)",
                                  "rgb(243,121,52)",
                                  "rgb(209,72,65)",
                                  "rgb(184,49,47)",
                                  "rgb(124,112,107)",
                                  "rgb(209,213,216)",
                                ],
                              },
                              blockType: {
                                inDropdown: true,
                                options: [
                                  "Normal",
                                  "H1",
                                  "H2",
                                  "H3",
                                  "H4",
                                  "H5",
                                  "H6",
                                  "Blockquote",
                                  "Code",
                                ],
                                className: "bg-transparent demo-option-custom",
                                component: undefined,
                                dropdownClassName: undefined,
                              },
                              link: {
                                inDropdown: false,
                                className: "demo-option-custom",
                                showOpenOptionOnHover: true,
                                defaultTargetOption: "_self",
                                options: ["link", "unlink"],
                                link: {
                                  icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEzLjk2Ny45NUEzLjIyNiAzLjIyNiAwIDAgMCAxMS42Ny4wMDJjLS44NyAwLTEuNjg2LjMzNy0yLjI5Ny45NDhMNy4xMDUgMy4yMThBMy4yNDcgMy4yNDcgMCAwIDAgNi4yNCA2LjI0YTMuMjI1IDMuMjI1IDAgMCAwLTMuMDIyLjg2NUwuOTUgOS4zNzNhMy4yNTMgMy4yNTMgMCAwIDAgMCA0LjU5NCAzLjIyNiAzLjIyNiAwIDAgMCAyLjI5Ny45NDhjLjg3IDAgMS42ODYtLjMzNiAyLjI5OC0uOTQ4TDcuODEyIDExLjdhMy4yNDcgMy4yNDcgMCAwIDAgLjg2NS0zLjAyMyAzLjIyNSAzLjIyNSAwIDAgMCAzLjAyMi0uODY1bDIuMjY4LTIuMjY3YTMuMjUyIDMuMjUyIDAgMCAwIDAtNC41OTV6TTcuMTA1IDEwLjk5M0w0LjgzNyAxMy4yNmEyLjIzMyAyLjIzMyAwIDAgMS0xLjU5LjY1NSAyLjIzMyAyLjIzMyAwIDAgMS0xLjU5LS42NTUgMi4yNTIgMi4yNTIgMCAwIDEgMC0zLjE4bDIuMjY4LTIuMjY4YTIuMjMyIDIuMjMyIDAgMCAxIDEuNTktLjY1NWMuNDMgMCAuODQxLjEyIDEuMTk1LjM0M0w0Ljc3MiA5LjQzOGEuNS41IDAgMSAwIC43MDcuNzA3bDEuOTM5LTEuOTM4Yy41NDUuODY4LjQ0MiAyLjAzLS4zMTMgMi43ODV6bTYuMTU1LTYuMTU1bC0yLjI2OCAyLjI2N2EyLjIzMyAyLjIzMyAwIDAgMS0xLjU5LjY1NWMtLjQzMSAwLS44NDEtLjEyLTEuMTk1LS4zNDNsMS45MzgtMS45MzhhLjUuNSAwIDEgMC0uNzA3LS43MDdMNy40OTkgNi43MWEyLjI1MiAyLjI1MiAwIDAgMSAuMzEzLTIuNzg1bDIuMjY3LTIuMjY4YTIuMjMzIDIuMjMzIDAgMCAxIDEuNTktLjY1NSAyLjIzMyAyLjIzMyAwIDAgMSAyLjI0NiAyLjI0NWMwIC42MDMtLjIzMiAxLjE2OC0uNjU1IDEuNTl6IiBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=",
                                  className: undefined,
                                },
                                unlink: {
                                  icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTMuOTU2IDEuMDM3YTMuNTUgMy41NSAwIDAgMC01LjAxNCAwTDYuNDM2IDMuNTQ0YS41NDUuNTQ1IDAgMSAwIC43Ny43N2wyLjUwOC0yLjUwNmEyLjQzOCAyLjQzOCAwIDAgMSAxLjczNS0uNzE1Yy42NTggMCAxLjI3NS4yNTQgMS43MzYuNzE1LjQ2LjQ2MS43MTUgMS4wNzguNzE1IDEuNzM2IDAgLjY1OC0uMjU0IDEuMjc0LS43MTUgMS43MzVMOS45MDcgOC41NThhMi40NTggMi40NTggMCAwIDEtMy40NzIgMCAuNTQ1LjU0NSAwIDEgMC0uNzcxLjc3MSAzLjUzNCAzLjUzNCAwIDAgMCAyLjUwNyAxLjAzN2MuOTA4IDAgMS44MTYtLjM0NiAyLjUwNy0xLjAzN2wzLjI3OC0zLjI3OGEzLjUyIDMuNTIgMCAwIDAgMS4wMzUtMi41MDdjMC0uOTUtLjM2Ny0xLjg0LTEuMDM1LTIuNTA3eiIvPjxwYXRoIGQ9Ik03LjQgMTEuMDY1bC0yLjEyMiAyLjEyYTIuNDM3IDIuNDM3IDAgMCAxLTEuNzM1LjcxNiAyLjQzNyAyLjQzNyAwIDAgMS0xLjczNi0uNzE1IDIuNDU3IDIuNDU3IDAgMCAxIDAtMy40NzFsMy4wODYtMy4wODZhMi40MzggMi40MzggMCAwIDEgMS43MzUtLjcxNWMuNjU4IDAgMS4yNzUuMjU0IDEuNzM2LjcxNWEuNTQ1LjU0NSAwIDEgMCAuNzcxLS43NzEgMy41NSAzLjU1IDAgMCAwLTUuMDE0IDBMMS4wMzYgOC45NDRBMy41MiAzLjUyIDAgMCAwIDAgMTEuNDVjMCAuOTUuMzY3IDEuODQgMS4wMzUgMi41MDdhMy41MiAzLjUyIDAgMCAwIDIuNTA2IDEuMDM1Yy45NSAwIDEuODQtLjM2OCAyLjUwNy0xLjAzNWwyLjEyMi0yLjEyMWEuNTQ1LjU0NSAwIDAgMC0uNzcxLS43NzF6TTkuMjc0IDEyLjAwMmEuNTQ2LjU0NiAwIDAgMC0uNTQ2LjU0NXYxLjYzN2EuNTQ2LjU0NiAwIDAgMCAxLjA5MSAwdi0xLjYzN2EuNTQ1LjU0NSAwIDAgMC0uNTQ1LS41NDV6TTExLjIzIDExLjYxNmEuNTQ1LjU0NSAwIDEgMC0uNzcyLjc3MmwxLjE1NyAxLjE1NmEuNTQzLjU0MyAwIDAgMCAuNzcxIDAgLjU0NS41NDUgMCAwIDAgMC0uNzdsLTEuMTU2LTEuMTU4ek0xMi41MzcgOS44MkgxMC45YS41NDYuNTQ2IDAgMCAwIDAgMS4wOTFoMS42MzdhLjU0Ni41NDYgMCAwIDAgMC0xLjA5ek00LjkxIDMuNTQ3YS41NDYuNTQ2IDAgMCAwIC41NDUtLjU0NVYxLjM2NmEuNTQ2LjU0NiAwIDAgMC0xLjA5IDB2MS42MzZjMCAuMzAxLjI0NC41NDUuNTQ1LjU0NXpNMi44ODggMy45MzNhLjU0My41NDMgMCAwIDAgLjc3MSAwIC41NDUuNTQ1IDAgMCAwIDAtLjc3MUwyLjUwMiAyLjAwNWEuNTQ1LjU0NSAwIDEgMC0uNzcxLjc3bDEuMTU3IDEuMTU4ek0xLjYyOCA1LjczaDEuNjM2YS41NDYuNTQ2IDAgMCAwIDAtMS4wOTJIMS42MjhhLjU0Ni41NDYgMCAwIDAgMCAxLjA5MXoiLz48L2c+PC9zdmc+",
                                  className: undefined,
                                },
                                linkCallback: undefined,
                              },
                              embedded: {
                                icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuNzA4IDYuNjE1YS40MzYuNDM2IDAgMCAwLS41NDMuMjkxbC0xLjgzIDYuMDQ1YS40MzYuNDM2IDAgMCAwIC44MzMuMjUyTDcgNy4xNmEuNDM2LjQzNiAwIDAgMC0uMjktLjU0NHpNOC45MzEgNi42MTVhLjQzNi40MzYgMCAwIDAtLjU0My4yOTFsLTEuODMgNi4wNDVhLjQzNi40MzYgMCAwIDAgLjgzNC4yNTJsMS44My02LjA0NGEuNDM2LjQzNiAwIDAgMC0uMjktLjU0NHoiLz48cGF0aCBkPSJNMTYuNTY0IDBILjQzNkEuNDM2LjQzNiAwIDAgMCAwIC40MzZ2MTYuMTI4YzAgLjI0LjE5NS40MzYuNDM2LjQzNmgxNi4xMjhjLjI0IDAgLjQzNi0uMTk1LjQzNi0uNDM2Vi40MzZBLjQzNi40MzYgMCAwIDAgMTYuNTY0IDB6TTMuNDg3Ljg3MmgxMC4wMjZ2MS43NDNIMy40ODdWLjg3MnptLTIuNjE1IDBoMS43NDN2MS43NDNILjg3MlYuODcyem0xNS4yNTYgMTUuMjU2SC44NzJWMy40ODhoMTUuMjU2djEyLjY0em0wLTEzLjUxM2gtMS43NDNWLjg3MmgxLjc0M3YxLjc0M3oiLz48Y2lyY2xlIGN4PSI5My44NjciIGN5PSIyNDUuMDY0IiByPSIxMy4xMjgiIHRyYW5zZm9ybT0ibWF0cml4KC4wMzMyIDAgMCAuMDMzMiAwIDApIi8+PGNpcmNsZSBjeD0iOTMuODY3IiBjeT0iMzYwLjU5MiIgcj0iMTMuMTI4IiB0cmFuc2Zvcm09Im1hdHJpeCguMDMzMiAwIDAgLjAzMzIgMCAwKSIvPjxwYXRoIGQ9Ik0xNC4yNTQgMTIuNjQxSDEwLjJhLjQzNi40MzYgMCAwIDAgMCAuODcyaDQuMDU0YS40MzYuNDM2IDAgMCAwIDAtLjg3MnoiLz48L3N2Zz4=",
                                className: "demo-option-custom",
                                embedCallback: undefined,
                                defaultSize: {
                                  height: "auto",
                                  width: "auto",
                                },
                              },
                              remove: {
                                icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOC4xIDE0bDYuNC03LjJjLjYtLjcuNi0xLjgtLjEtMi41bC0yLjctMi43Yy0uMy0uNC0uOC0uNi0xLjMtLjZIOC42Yy0uNSAwLTEgLjItMS40LjZMLjUgOS4yYy0uNi43LS42IDEuOS4xIDIuNWwyLjcgMi43Yy4zLjQuOC42IDEuMy42SDE2di0xSDguMXptLTEuMy0uMXMwLS4xIDAgMGwtMi43LTIuN2MtLjQtLjQtLjQtLjkgMC0xLjNMNy41IDZoLTFsLTMgMy4zYy0uNi43LS42IDEuNy4xIDIuNEw1LjkgMTRINC42Yy0uMiAwLS40LS4xLS42LS4yTDEuMiAxMWMtLjMtLjMtLjMtLjggMC0xLjFMNC43IDZoMS44TDEwIDJoMUw3LjUgNmwzLjEgMy43LTMuNSA0Yy0uMS4xLS4yLjEtLjMuMnoiLz48L3N2Zz4=",
                                className: "demo-option-custom",
                              },
                            }}
                          /> */}
                          {/* <CKEditor
                            editor={ClassicEditor}
                            data={_this.props.articleForm.description}
                            onReady={(editor) => {
                              // You can store the "editor" and use when it is needed.
                              console.log("Editor is ready to use!", editor);
                            }}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              console.log({ event, editor, data });
                              let tempObj = { ..._this.props.articleForm };
                              if (
                                _this.props.articleForm.description !== data
                              ) {
                                tempObj["messageText"] = data;
                                console.log("editor");
                                tempObj.showButton = false;
                                this.props.setArticleForm(tempObj);
                              }
                            }}
                            onBlur={(event, editor) => {
                              console.log("Blur.", editor);
                            }}
                            onFocus={(event, editor) => {
                              console.log("Focus.", editor);
                            }}
                          /> */}
                          {this.props.articleForm.subtype == "slug" ? (
                            <iframe
                              src={this.props.articleForm.slug}
                              title=""
                              frameborder="0"
                              scrolling="yes"
                              allowfullscreen="true"
                              style={{
                                display: "block",
                                height: "70vh",
                                // width: "41vw",
                                overflow: "auto",
                              }}
                            ></iframe>
                          ) : (
                            <Editor
                              apiKey="your-api-key"
                              onInit={(evt, editor) =>
                                (this.editorRef.current = editor)
                              }
                              initialValue={_this.props.articleForm.description}
                              init={{
                                height: 400,
                                menubar: false,
                                branding: false,
                                plugins: [
                                  "preview",
                                  "importcss",
                                  "searchreplace",
                                  "autolink",
                                  "autosave",
                                  "save",
                                  "directionality",
                                  "code",
                                  "visualblocks",
                                  "visualchars",
                                  "fullscreen",
                                  "image",
                                  "link",
                                  "media",
                                  "template",
                                  "codesample",
                                  "table",
                                  "charmap",
                                  "pagebreak",
                                  "nonbreaking",
                                  "anchor",
                                  "insertdatetime",
                                  "advlist",
                                  "lists",
                                  "wordcount",
                                  "help",
                                  "charmap",
                                  "quickbars",
                                  "emoticons",
                                ],
                                toolbar:
                                  "undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
                                menubar:
                                  "file edit view insert format tools table help",
                                content_style:
                                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                file_picker_callback: (
                                  callback,
                                  value,
                                  meta
                                ) => {
                                  if (
                                    meta.filetype == "image" ||
                                    meta.filetype == "media"
                                  ) {
                                    var input =
                                      document.getElementById("my-file");
                                    input.click();
                                    input.onchange = async function () {
                                      var file = input.files[0];
                                      _this.context.showLoading();
                                      let a = await _this.uploadImageCallBackfn(
                                        file,
                                        meta.filetype == "media"
                                          ? "video"
                                          : meta.filetype
                                      );
                                      _this.context.showLoading(false);
                                      console.log("name", a);
                                      var reader = new FileReader();
                                      reader.onload = function (e) {
                                        callback(a.data.link, {
                                          alt: file.name,
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                    };
                                    // alert();
                                  }
                                },
                                video_template_callback: function (data) {
                                  return (
                                    '<video width="' +
                                    data.width +
                                    '" height="' +
                                    data.height +
                                    '"' +
                                    (data.poster
                                      ? ' poster="' + data.poster + '"'
                                      : "") +
                                    ' controls="controls" autoplay="autoplay" loop="loop">\n' +
                                    '<source src="' +
                                    data.source +
                                    '"' +
                                    (data.sourcemime
                                      ? ' type="' + data.sourcemime + '"'
                                      : "") +
                                    " />\n" +
                                    (data.altsource
                                      ? '<source src="' +
                                        data.altsource +
                                        '"' +
                                        (data.altsourcemime
                                          ? ' type="' + data.altsourcemime + '"'
                                          : "") +
                                        " />\n"
                                      : "") +
                                    "</video>"
                                  );
                                },
                              }}
                              onEditorChange={(newValue, editor) => {
                                console.log(newValue);
                                let tempObj = { ..._this.props.articleForm };
                                if (
                                  _this.props.articleForm.description !==
                                  newValue
                                ) {
                                  tempObj["messageText"] = newValue;
                                  tempObj["subtype"] = "editor";
                                  tempObj.showButton = false;
                                  this.props.setArticleForm(tempObj);
                                }
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>

        <input type="file" hidden id="my-file" />

        <Dialog
          open={this.state.categoryModel}
          onClose={this.handleCategoryModelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="knowdledge-base-folder-model-popup-block"
        >
          <span className="cross-icon-block">
            <IconButton onClick={this.handleCategoryModelClose}>
              <img src={crossX} alt="" />
            </IconButton>
          </span>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="desc-block">
                <p className="title">Create new category</p>
                <div className="input-field-block">
                  <Form.Group
                    className=""
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      type="text"
                      className="input-field"
                      name="name"
                      value={this.props.categoryForm.name}
                      placeholder="Category name"
                      onChange={(e) => {
                        const { name, value } = e.target;
                        let tempObj = { ...this.props.categoryForm };
                        tempObj[name] = value;
                        this.props.setCategoryForm(tempObj);
                        this.setState({
                          loading: false,
                          delete: false,
                          checkBoxEdit: false,
                        });
                      }}
                    />
                  </Form.Group>

                  <div className="btn-block">
                    <Button
                      className="cancel-btn"
                      variant="contained"
                      onClick={this.handleCategoryModelClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="submit-btn"
                      variant="contained"
                      onClick={this.createAndUpdateCategory}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.folderModel}
          onClose={this.handleFolderModelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="knowdledge-base-folder-model-popup-block"
        >
          <span className="cross-icon-block">
            <IconButton onClick={this.handleFolderModelClose}>
              <img src={crossX} alt="" />
            </IconButton>
          </span>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="desc-block">
                <p className="title">Create new folder</p>
                <div className="input-field-block">
                  <Form.Group
                    className=""
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      type="text"
                      className="input-field"
                      placeholder="Folder name"
                    />
                  </Form.Group>

                  <FloatingLabel
                    controlId="floatingSelect"
                    className="floating-select-field"
                    label="Choose category"
                  >
                    <Form.Select aria-label="Floating label select example">
                      <option>Category 2</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </FloatingLabel>

                  <div className="btn-block">
                    <Button
                      className="cancel-btn"
                      variant="contained"
                      onClick={this.handleFolderModelClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="submit-btn"
                      variant="contained"
                      onClick={this.handleFolderModelClose}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const category = state.knowledgeBase.categorylist || [];
  const article = state.knowledgeBase.article || {};
  const categoryForm = state.knowledgeBase.categoryForm || {};
  const articleForm = state.knowledgeBase.articleForm || {};
  return {
    category,
    article,
    categoryForm,
    articleForm,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setCategory: (data) => {
      dispatch(setKnowledgeCategory(data));
    },
    setArticle: (data) => {
      dispatch(setKnowledgeArticle(data));
    },
    setCategoryForm: (data) => {
      dispatch(setKnowledgeCategoryForm(data));
    },
    setArticleForm: (data) => {
      dispatch(setKnowledgeArticleForm(data));
      console.log(setKnowledgeArticleForm(data));
    },
  };
}

// export default connect(mapStateToProps, mapDispatchToProps)(KnowledgeBaseSettingComponent);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(KnowledgeBaseSettingComponent);

// export default KnowledgeBaseSettingComponent;
